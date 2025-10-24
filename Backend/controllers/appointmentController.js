const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date, doctorId, patientId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    if (status) whereClause.status = status;
    if (date) whereClause.appointmentDate = date;
    if (doctorId) whereClause.doctorId = doctorId;
    if (patientId) whereClause.patientId = patientId;

    // Role-based filtering
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (doctor) whereClause.doctorId = doctor.id;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (patient) whereClause.patientId = patient.id;
    }

    const { count, rows } = await Appointment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        appointments: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
      error: error.message
    });
  }
};

// Get single appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment',
      error: error.message
    });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime, type, reason } = req.body;

    // Check if patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if doctor is available
    if (doctor.availability !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available'
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate,
        appointmentTime,
        status: {
          [Op.in]: ['scheduled', 'confirmed']
        }
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      type: type || 'consultation',
      reason
    });

    const fullAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: fullAppointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime, type, status, notes } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // If rescheduling, check for conflicts
    if (appointmentDate && appointmentTime) {
      const conflictingAppointment = await Appointment.findOne({
        where: {
          id: { [Op.ne]: id },
          doctorId: appointment.doctorId,
          appointmentDate,
          appointmentTime,
          status: {
            [Op.in]: ['scheduled', 'confirmed']
          }
        }
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked'
        });
      }
    }

    await appointment.update({
      appointmentDate,
      appointmentTime,
      type,
      status,
      notes
    });

    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await appointment.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

// Get today's appointments
exports.getTodayAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let whereClause = { appointmentDate: today };

    // Role-based filtering
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (doctor) whereClause.doctorId = doctor.id;
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ],
      order: [['appointmentTime', 'ASC']]
    });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get today appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get today\'s appointments',
      error: error.message
    });
  }
};

// Get appointment statistics
exports.getAppointmentStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const totalAppointments = await Appointment.count();
    const todayAppointments = await Appointment.count({
      where: { appointmentDate: today }
    });
    const scheduledAppointments = await Appointment.count({
      where: { status: 'scheduled' }
    });
    const completedAppointments = await Appointment.count({
      where: { status: 'completed' }
    });
    const cancelledAppointments = await Appointment.count({
      where: { status: 'cancelled' }
    });

    res.json({
      success: true,
      data: {
        totalAppointments,
        todayAppointments,
        scheduledAppointments,
        completedAppointments,
        cancelledAppointments
      }
    });
  } catch (error) {
    console.error('Get appointment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment statistics',
      error: error.message
    });
  }// backend/controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date, doctorId, patientId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    if (status) whereClause.status = status;
    if (date) whereClause.appointmentDate = date;
    if (doctorId) whereClause.doctorId = doctorId;
    if (patientId) whereClause.patientId = patientId;

    // Role-based filtering
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (doctor) whereClause.doctorId = doctor.id;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (patient) whereClause.patientId = patient.id;
    }

    const { count, rows } = await Appointment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        appointments: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
      error: error.message
    });
  }
};

// Get single appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment',
      error: error.message
    });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime, type, reason } = req.body;

    // Check if patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if doctor is available
    if (doctor.availability !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available'
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate,
        appointmentTime,
        status: {
          [Op.in]: ['scheduled', 'confirmed']
        }
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      type: type || 'consultation',
      reason
    });

    const fullAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: fullAppointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime, type, status, notes } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // If rescheduling, check for conflicts
    if (appointmentDate && appointmentTime) {
      const conflictingAppointment = await Appointment.findOne({
        where: {
          id: { [Op.ne]: id },
          doctorId: appointment.doctorId,
          appointmentDate,
          appointmentTime,
          status: {
            [Op.in]: ['scheduled', 'confirmed']
          }
        }
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked'
        });
      }
    }

    await appointment.update({
      appointmentDate,
      appointmentTime,
      type,
      status,
      notes
    });

    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await appointment.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

// Get today's appointments
exports.getTodayAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let whereClause = { appointmentDate: today };

    // Role-based filtering
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (doctor) whereClause.doctorId = doctor.id;
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ],
      order: [['appointmentTime', 'ASC']]
    });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get today appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get today\'s appointments',
      error: error.message
    });
  }
};

// Get appointment statistics
exports.getAppointmentStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const totalAppointments = await Appointment.count();
    const todayAppointments = await Appointment.count({
      where: { appointmentDate: today }
    });
    const scheduledAppointments = await Appointment.count({
      where: { status: 'scheduled' }
    });
    const completedAppointments = await Appointment.count({
      where: { status: 'completed' }
    });
    const cancelledAppointments = await Appointment.count({
      where: { status: 'cancelled' }
    });

    res.json({
      success: true,
      data: {
        totalAppointments,
        todayAppointments,
        scheduledAppointments,
        completedAppointments,
        cancelledAppointments
      }
    });
  } catch (error) {
    console.error('Get appointment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment statistics',
      error: error.message
    });
  }
};
};