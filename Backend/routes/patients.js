const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const patientController = require('../controllers/patientController');

// Get all patients
router.get('/', 
  authenticateToken, 
  authorizeRole('admin', 'doctor', 'nurse'), 
  patientController.getAllPatients
);

// Get patient statistics
router.get('/stats', 
  authenticateToken, 
  authorizeRole('admin'), 
  patientController.getPatientStats
);

// Get single patient
router.get('/:id', 
  authenticateToken, 
  patientController.getPatientById
);

// Create patient
router.post('/', 
  authenticateToken, 
  authorizeRole('admin'), 
  patientController.createPatient
);

// Update patient
router.put('/:id', 
  authenticateToken, 
  authorizeRole('admin', 'doctor', 'nurse', 'patient'), 
  patientController.updatePatient
);

// Delete patient
router.delete('/:id', 
  authenticateToken, 
  authorizeRole('admin'), 
  patientController.deletePatient
);

module.exports = router;