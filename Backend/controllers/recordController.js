const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Get all medical records
exports.getAllRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, patientId, doctorId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    if (patientId) whereClause.patientId = patientId;
    if (doctorId) whereClause.doctorId = doctorId;

    // Role-based filtering
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (doctor) whereClause.doctorId = doctor.id;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (patient) whereClause.patientId = patient.id;
    }

    const { count, rows } = await MedicalRecord.findAndCountAll({
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
            attributes: ['id', 'name', 'email']
          }]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['visitDate', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        records: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical records',
      error: error.message
    });
  }
};

// Get single medical record
exports.getRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await MedicalRecord.findByPk(id, {
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
            attributes: ['id', 'name', 'email']
          }]
        }
      ]
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical record',
      error: error.message
    });
  }
};

// Create medical record
exports.createRecord = async (req, res) => {
  try {
    const { patientId, doctorId, diagnosis, symptoms, prescription, labTests, treatmentNotes, followUpDate } = req.body;

    // If doctor is making request, use their ID
    let finalDoctorId = doctorId;
    if (req.user.role === 'doctor' && !doctorId) {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (doctor) finalDoctorId = doctor.id;
    }

    // Check if patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findByPk(finalDoctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Create medical record
    const record = await MedicalRecord.create({
      patientId,
      doctorId: finalDoctorId,
      diagnosis,
      symptoms,
      prescription,
      labTests,
      treatmentNotes,
      followUpDate
    });

    const fullRecord = await MedicalRecord.findByPk(record.id, {
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
            attributes: ['id', 'name', 'email']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: fullRecord
    });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create medical record',
      error: error.message
    });
  }
};

// Update medical record
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, symptoms, prescription, labTests, treatmentNotes, followUpDate } = req.body;

    const record = await MedicalRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Only the doctor who created the record can update it (unless admin)
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (doctor && record.doctorId !== doctor.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own records'
        });
      }
    }

    await record.update({
      diagnosis,
      symptoms,
      prescription,
      labTests,
      treatmentNotes,
      followUpDate
    });

    const updatedRecord = await MedicalRecord.findByPk(id, {
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
            attributes: ['id', 'name', 'email']
          }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Medical record updated successfully',
      data: updatedRecord
    });
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update medical record',
      error: error.message
    });
  }
};

// Delete medical record
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await MedicalRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    await record.destroy();

    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete medical record',
      error: error.message
    });
  }
};

// Get patient history
exports.getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await MedicalRecord.findAll({
      where: { patientId },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name']
          }]
        }
      ],
      order: [['visitDate', 'DESC']]
    });

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get patient history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patient history',
      error: error.message
    });
  }
};