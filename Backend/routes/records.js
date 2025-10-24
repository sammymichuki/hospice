const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const recordController = require('../controllers/recordController');

// Get all medical records
router.get('/', 
  authenticateToken, 
  recordController.getAllRecords
);

// Get single medical record
router.get('/:id', 
  authenticateToken, 
  recordController.getRecordById
);

// Get patient history
router.get('/patient/:patientId/history', 
  authenticateToken, 
  recordController.getPatientHistory
);

// Create medical record
router.post('/', 
  authenticateToken, 
  authorizeRole('admin', 'doctor'), 
  recordController.createRecord
);

// Update medical record
router.put('/:id', 
  authenticateToken, 
  authorizeRole('admin', 'doctor'), 
  recordController.updateRecord
);

// Delete medical record
router.delete('/:id', 
  authenticateToken, 
  authorizeRole('admin'), 
  recordController.deleteRecord
);

module.exports = router;