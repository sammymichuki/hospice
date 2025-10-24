const Inventory = require('../models/Inventory');
const { Op } = require('sequelize');

// Get all inventory items
exports.getAllItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (search) {
      whereClause.itemName = {
        [Op.like]: `%${search}%`
      };
    }

    const { count, rows } = await Inventory.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        items: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inventory items',
      error: error.message
    });
  }
};

// Get single inventory item
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get item',
      error: error.message
    });
  }
};

// Create inventory item
exports.createItem = async (req, res) => {
  try {
    const { itemName, category, quantity, minQuantity, unitPrice, supplier, expiryDate, batchNumber, description } = req.body;

    const item = await Inventory.create({
      itemName,
      category,
      quantity,
      minQuantity: minQuantity || 10,
      unitPrice,
      supplier,
      expiryDate,
      batchNumber,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create item',
      error: error.message
    });
  }
};

// Update inventory item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, category, quantity, minQuantity, unitPrice, supplier, expiryDate, batchNumber, description } = req.body;

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await item.update({
      itemName,
      category,
      quantity,
      minQuantity,
      unitPrice,
      supplier,
      expiryDate,
      batchNumber,
      description
    });

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item',
      error: error.message
    });
  }
};

// Delete inventory item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await item.destroy();

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message
    });
  }
};

// Update stock quantity
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    let newQuantity = item.quantity;
    
    if (operation === 'add') {
      newQuantity += parseInt(quantity);
    } else if (operation === 'subtract') {
      newQuantity -= parseInt(quantity);
      if (newQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation. Use "add" or "subtract"'
      });
    }

    await item.update({ quantity: newQuantity });

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.findAll({
      where: {
        status: {
          [Op.in]: ['low_stock', 'out_of_stock']
        }
      },
      order: [['quantity', 'ASC']]
    });

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get low stock items',
      error: error.message
    });
  }
};

// Get expired items
exports.getExpiredItems = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const items = await Inventory.findAll({
      where: {
        expiryDate: {
          [Op.lt]: today
        }
      },
      order: [['expiryDate', 'ASC']]
    });

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get expired items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expired items',
      error: error.message
    });
  }
};

// Get items expiring soon (within 30 days)
exports.getExpiringSoonItems = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const items = await Inventory.findAll({
      where: {
        expiryDate: {
          [Op.between]: [today.toISOString().split('T')[0], thirtyDaysLater.toISOString().split('T')[0]]
        }
      },
      order: [['expiryDate', 'ASC']]
    });

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get expiring soon items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expiring soon items',
      error: error.message
    });
  }
};

// Get inventory statistics
exports.getInventoryStats = async (req, res) => {
  try {
    const totalItems = await Inventory.count();
    const lowStockItems = await Inventory.count({
      where: { status: 'low_stock' }
    });
    const outOfStockItems = await Inventory.count({
      where: { status: 'out_of_stock' }
    });
    const expiredItems = await Inventory.count({
      where: { status: 'expired' }
    });

    const totalValue = await Inventory.sum('unitPrice', {
      where: { status: { [Op.ne]: 'expired' } }
    });

    const categoryCount = await Inventory.findAll({
      attributes: [
        'category',
        [Inventory.sequelize.fn('COUNT', Inventory.sequelize.col('id')), 'count']
      ],
      group: ['category']
    });

    res.json({
      success: true,
      data: {
        totalItems,
        lowStockItems,
        outOfStockItems,
        expiredItems,
        totalValue: totalValue || 0,
        categoryCount
      }
    });
  } catch (error) {
    console.error('Get inventory stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inventory statistics',
      error: error.message
    });
  }
};