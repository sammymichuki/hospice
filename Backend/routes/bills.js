const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const billController = require('../controllers/billController');

// Get all bills
router.get('/', 
  authenticateToken, 
  billController.getAllBills
);

// Get billing statistics
router.get('/stats', 
  authenticateToken, 
  authorizeRole('admin'), 
  billController.getBillingStats
);

// Get single bill
router.get('/:id', 
  authenticateToken, 
  billController.getBillById
);

// Create bill
router.post('/', 
  authenticateToken, 
  authorizeRole('admin', 'doctor'), 
  billController.createBill
);

// Update bill
router.put('/:id', 
  authenticateToken, 
  authorizeRole('admin'), 
  billController.updateBill
);

// Process payment
router.post('/:id/payment', 
  authenticateToken, 
  billController.processPayment
);

// Delete bill
router.delete('/:id', 
  authenticateToken, 
  authorizeRole('admin'), 
  billController.deleteBill
);

module.exports = router;