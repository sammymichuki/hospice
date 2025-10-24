const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Patient = sequelize.define('Patient', {
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
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  bloodGroup: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emergencyContact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  medicalHistory: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'patients'
});

// Associations
Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Patient, { foreignKey: 'userId', as: 'patientProfile' });

module.exports = Patient;