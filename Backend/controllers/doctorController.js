const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', specialization = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    if (specialization) {
      whereClause.specialization = specialization;
    }

    if (search) {
      whereClause['$user.name$'] = {
        [Op.like]: `%${search}%`
      };
    }

    const { count, rows } = await Doctor.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'status']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        doctors: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctors',
      error: error.message
    });
  }
};

// Get single doctor
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'status']
      }]
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor',
      error: error.message
    });
  }
};

// Create new doctor
exports.createDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, qualification, experience, licenseNumber, consultationFee, schedule } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Check if license number exists
    const existingLicense = await Doctor.findOne({ where: { licenseNumber } });
    if (existingLicense) {
      return res.status(400).json({
        success: false,
        message: 'License number already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'doctor'
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user.id,
      specialization,
      qualification,
      experience: experience || 0,
      licenseNumber,
      consultationFee: consultationFee || 0,
      schedule
    });

    const fullDoctor = await Doctor.findByPk(doctor.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'status']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: fullDoctor
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor',
      error: error.message
    });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, specialization, qualification, experience, consultationFee, schedule, availability } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Update user info
    await User.update(
      { name, phone },
      { where: { id: doctor.userId } }
    );

    // Update doctor info
    await doctor.update({
      specialization,
      qualification,
      experience,
      consultationFee,
      schedule,
      availability
    });

    const updatedDoctor = await Doctor.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'status']
      }]
    });

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor',
      error: error.message
    });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Delete doctor and user
    await doctor.destroy();
    await User.destroy({ where: { id: doctor.userId } });

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete doctor',
      error: error.message
    });
  }
};

// Get doctor's schedule
exports.getDoctorSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      attributes: ['id', 'schedule', 'availability'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['name']
      }]
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get schedule',
      error: error.message
    });
  }
};

// Update doctor's schedule
exports.updateDoctorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedule, availability } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    await doctor.update({ schedule, availability });

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update schedule',
      error: error.message
    });
  }
};

// Get available doctors
exports.getAvailableDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;
    
    let whereClause = { availability: 'available' };
    
    if (specialization) {
      whereClause.specialization = specialization;
    }

    const doctors = await Doctor.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone']
      }]
    });

    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error('Get available doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available doctors',
      error: error.message
    });
  }
};      