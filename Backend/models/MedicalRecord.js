const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const MedicalRecord = sequelize.define('MedicalRecord', {
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
  visitDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  labTests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treatmentNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  followUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'medical_records'
});

// Associations
MedicalRecord.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Patient.hasMany(MedicalRecord, { foreignKey: 'patientId', as: 'medicalRecords' });
Doctor.hasMany(MedicalRecord, { foreignKey: 'doctorId', as: 'medicalRecords' });

module.exports = MedicalRecord;