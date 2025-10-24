// backend/models/Bill.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Patient = require('./Patient');

const Bill = sequelize.define('Bill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'patients',
      key: 'id'
    }
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  balanceAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'partially_paid', 'overdue'),
    defaultValue: 'pending'
  },
  billDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  services: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of services with name, quantity, price'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'insurance', 'online'),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'bills'
});

// Associations
Bill.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Patient.hasMany(Bill, { foreignKey: 'patientId', as: 'bills' });

// Hook to generate invoice number
Bill.beforeCreate(async (bill) => {
  if (!bill.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await Bill.count() + 1;
    bill.invoiceNumber = `INV-${year}${month}-${String(count).padStart(4, '0')}`;
  }
});

module.exports = Bill;