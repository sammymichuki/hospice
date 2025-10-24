const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const doctorController = require('../controllers/doctorController');

// Get all doctors
router.get('/', 
  authenticateToken, 
  doctorController.getAllDoctors
);

// Get available doctors
router.get('/available', 
  authenticateToken, 
  doctorController.getAvailableDoctors
);

// Get single doctor
router.get('/:id', 
  authenticateToken, 
  doctorController.getDoctorById
);

// Get doctor schedule
router.get('/:id/schedule', 
  authenticateToken, 
  doctorController.getDoctorSchedule
);

// Create doctor
router.post('/', 
  authenticateToken, 
  authorizeRole('admin'), 
  doctorController.createDoctor
);

// Update doctor
router.put('/:id', 
  authenticateToken, 
  authorizeRole('admin', 'doctor'), 
  doctorController.updateDoctor
);

// Update doctor schedule
router.put('/:id/schedule', 
  authenticateToken, 
  authorizeRole('admin', 'doctor'), 
  doctorController.updateDoctorSchedule
);

// Delete doctor
router.delete('/:id', 
  authenticateToken, 
  authorizeRole('admin'), 
  doctorController.deleteDoctor
);

module.exports = router;