const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const inventoryController = require('../controllers/inventoryController');

// Get all inventory items
router.get('/', 
  authenticateToken, 
  inventoryController.getAllItems
);

// Get inventory statistics
router.get('/stats', 
  authenticateToken, 
  authorizeRole('admin'), 
  inventoryController.getInventoryStats
);

// Get low stock items
router.get('/low-stock', 
  authenticateToken, 
  inventoryController.getLowStockItems
);

// Get expired items
router.get('/expired', 
  authenticateToken, 
  inventoryController.getExpiredItems
);

// Get expiring soon items
router.get('/expiring-soon', 
  authenticateToken, 
  inventoryController.getExpiringSoonItems
);

// Get single item
router.get('/:id', 
  authenticateToken, 
  inventoryController.getItemById
);

// Create item
router.post('/', 
  authenticateToken, 
  authorizeRole('admin'), 
  inventoryController.createItem
);

// Update item
router.put('/:id', 
  authenticateToken, 
  authorizeRole('admin'), 
  inventoryController.updateItem
);

// Update stock quantity
router.put('/:id/stock', 
  authenticateToken, 
  authorizeRole('admin', 'nurse'), 
  inventoryController.updateStock
);

// Delete item
router.delete('/:id', 
  authenticateToken, 
  authorizeRole('admin'), 
  inventoryController.deleteItem
);

module.exports = router;