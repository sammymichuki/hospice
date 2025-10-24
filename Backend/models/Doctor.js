const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  consultationFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  schedule: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Weekly schedule in JSON format'
  },
  availability: {
    type: DataTypes.ENUM('available', 'on_leave', 'busy'),
    defaultValue: 'available'
  }
}, {
  timestamps: true,
  tableName: 'doctors'
});

// Associations
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctorProfile' });

module.exports = Doctor;