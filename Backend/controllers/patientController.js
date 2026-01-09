const Patient = require('../models/Patient');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search ? {
      '$user.name$': {
        [Op.like]: `%${search}%`
      }
    } : {};

    const { count, rows } = await Patient.findAndCountAll({
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
        patients: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patients',
      error: error.message
    });
  }
};

// Get single patient
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'status']
      }]
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patient',
      error: error.message
    });
  }
};

// Create new patient
exports.createPatient = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, bloodGroup, address, emergencyContact } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'patient'
    });

    // Create patient profile
    const patient = await Patient.create({
      userId: user.id,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact
    });

    const fullPatient = await Patient.findByPk(patient.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'status']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: fullPatient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create patient',
      error: error.message
    });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName, lastName, email, phone, dateOfBirth, gender, bloodGroup, address,
      emergencyContactName, emergencyContactPhone, emergencyContactRelation,
      allergies, chronicConditions
    } = req.body;

    const loggedInUser = req.user; // User object from authentication middleware

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Authorization check: Patient can only update their own profile
    if (loggedInUser.role === 'patient' && patient.userId !== loggedInUser.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only update your own patient profile.'
      });
    }

    // Update User info
    const userUpdateData = {};
    if (firstName && lastName) {
      userUpdateData.name = `${firstName} ${lastName}`;
    } else if (firstName) {
      userUpdateData.name = firstName;
    }
    // Don't allow changing email here, it should be a separate process if allowed
    if (phone) {
      userUpdateData.phone = phone;
    }
    // Only update if there's data to update
    if (Object.keys(userUpdateData).length > 0) {
      await User.update(userUpdateData, { where: { id: patient.userId } });
    }

    // Update patient info
    const patientUpdateData = {};
    if (dateOfBirth) patientUpdateData.dateOfBirth = dateOfBirth;
    if (gender) patientUpdateData.gender = gender;
    if (bloodGroup) patientUpdateData.bloodGroup = bloodGroup;
    if (address) patientUpdateData.address = address;
    if (emergencyContactName || emergencyContactPhone || emergencyContactRelation) {
      patientUpdateData.emergencyContact = `${emergencyContactName || ''} - ${emergencyContactPhone || ''} - ${emergencyContactRelation || ''}`.trim().replace(/ - /g, ' ').replace(/\s+/g, ' ');
    }
    if (allergies) patientUpdateData.allergies = allergies;
    if (chronicConditions) patientUpdateData.medicalHistory = chronicConditions; // Mapping chronicConditions to medicalHistory

    // Only update if there's data to update
    if (Object.keys(patientUpdateData).length > 0) {
      await patient.update(patientUpdateData);
    }

    const updatedPatient = await Patient.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'status']
      }]
    });

    res.json({
      success: true,
      message: 'Patient profile updated successfully',
      data: updatedPatient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update patient profile',
      error: error.message
    });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Delete patient and user
    await patient.destroy();
    await User.destroy({ where: { id: patient.userId } });

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete patient',
      error: error.message
    });
  }
};

// Get patient statistics
exports.getPatientStats = async (req, res) => {
  try {
    const totalPatients = await Patient.count();
    const activePatients = await Patient.count({
      include: [{
        model: User,
        as: 'user',
        where: { status: 'active' }
      }]
    });

    const malePatients = await Patient.count({ where: { gender: 'male' } });
    const femalePatients = await Patient.count({ where: { gender: 'female' } });

    res.json({
      success: true,
      data: {
        totalPatients,
        activePatients,
        malePatients,
        femalePatients
      }
    });
  } catch (error) {
    console.error('Get patient stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patient statistics',
      error: error.message
    });
  }
};