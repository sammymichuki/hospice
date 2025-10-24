const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('medicine', 'equipment', 'supplies', 'consumables'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  minQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    comment: 'Minimum quantity for low stock alert'
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  batchNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('in_stock', 'low_stock', 'out_of_stock', 'expired'),
    defaultValue: 'in_stock'
  }
}, {
  timestamps: true,
  tableName: 'inventory'
});

// Hook to update status based on quantity
Inventory.beforeSave(async (item) => {
  if (item.quantity <= 0) {
    item.status = 'out_of_stock';
  } else if (item.quantity <= item.minQuantity) {
    item.status = 'low_stock';
  } else {
    item.status = 'in_stock';
  }
  
  // Check expiry
  if (item.expiryDate && new Date(item.expiryDate) < new Date()) {
    item.status = 'expired';
  }
});

module.exports = Inventory;