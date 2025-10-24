const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const Appointment = sequelize.define('Appointment', {
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
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'doctors',
      key: 'id'
    }
  },
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  appointmentTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('consultation', 'follow_up', 'emergency', 'checkup'),
    defaultValue: 'consultation'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'),
    defaultValue: 'scheduled'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'appointments'
});

// Associations
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });

module.exports = Appointment;