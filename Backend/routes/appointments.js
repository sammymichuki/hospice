const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

// Get all appointments
router.get('/', 
  authenticateToken, 
  appointmentController.getAllAppointments
);

// Get appointment statistics
router.get('/stats', 
  authenticateToken, 
  authorizeRole('admin', 'doctor'), 
  appointmentController.getAppointmentStats
);

// Get today's appointments
router.get('/today', 
  authenticateToken, 
  appointmentController.getTodayAppointments
);

// Get single appointment
router.get('/:id', 
  authenticateToken, 
  appointmentController.getAppointmentById
);

// Create appointment
router.post('/', 
  authenticateToken, 
  appointmentController.createAppointment
);

// Update appointment
router.put('/:id', 
  authenticateToken, 
  appointmentController.updateAppointment
);

// Cancel appointment
router.put('/:id/cancel', 
  authenticateToken, 
  appointmentController.cancelAppointment
);

module.exports = router;