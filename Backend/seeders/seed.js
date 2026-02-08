// backend/seeders/seed.js
const { sequelize } = require('../config/database');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Bill = require('../models/Bill');
const Inventory = require('../models/Inventory');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // ============================================
    // CREATE USERS
    // ============================================
    console.log('Creating users...');
    
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@hospital.com',
      password: 'password123',
      role: 'admin',
      phone: '+1234567890',
      status: 'active'
    });
    console.log('✅ Admin created: admin@hospital.com');

    const doctorUser1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'doctor@hospital.com',
      password: 'password123',
      role: 'doctor',
      phone: '+1234567891',
      status: 'active'
    });
    console.log('✅ Doctor created: doctor@hospital.com');

    const doctorUser2 = await User.create({
      name: 'Dr. Michael Brown',
      email: 'michael.brown@hospital.com',
      password: 'password123',
      role: 'doctor',
      phone: '+1234567894',
      status: 'active'
    });
    console.log('✅ Doctor created: michael.brown@hospital.com');

    const nurseUser = await User.create({
      name: 'Nurse Mary Smith',
      email: 'nurse@hospital.com',
      password: 'password123',
      role: 'nurse',
      phone: '+1234567892',
      status: 'active'
    });
    console.log('✅ Nurse created: nurse@hospital.com');

    const patientUser1 = await User.create({
      name: 'John Doe',
      email: 'patient@hospital.com',
      password: 'password123',
      role: 'patient',
      phone: '+1234567893',
      status: 'active'
    });
    console.log('✅ Patient created: patient@hospital.com');

    const patientUser2 = await User.create({
      name: 'Jane Smith',
      email: 'jane.smith@hospital.com',
      password: 'password123',
      role: 'patient',
      phone: '+1234567895',
      status: 'active'
    });
    console.log('✅ Patient created: jane.smith@hospital.com\n');

    // ============================================
    // CREATE DOCTORS
    // ============================================
    console.log('Creating doctor profiles...');
    
    const doctor1 = await Doctor.create({
      userId: doctorUser1.id,
      specialization: 'Cardiology',
      qualification: 'MD, MBBS, Cardiology',
      experience: 15,
      licenseNumber: 'DOC-2024-001',
      consultationFee: 150.00,
      availability: 'available'
    });
    console.log('✅ Doctor profile created for Dr. Sarah Johnson');

    const doctor2 = await Doctor.create({
      userId: doctorUser2.id,
      specialization: 'Orthopedics',
      qualification: 'MD, MS Orthopedics',
      experience: 10,
      licenseNumber: 'DOC-2024-002',
      consultationFee: 120.00,
      availability: 'available'
    });
    console.log('✅ Doctor profile created for Dr. Michael Brown\n');

    // ============================================
    // CREATE PATIENTS
    // ============================================
    console.log('Creating patient profiles...');
    
    const patient1 = await Patient.create({
      userId: patientUser1.id,
      dateOfBirth: '1990-05-15',
      gender: 'male',
      bloodGroup: 'A+',
      address: '123 Main Street, New York, NY 10001',
      emergencyContact: '+1234567896',
      medicalHistory: 'No major medical history',
      allergies: 'None'
    });
    console.log('✅ Patient profile created for John Doe');

    const patient2 = await Patient.create({
      userId: patientUser2.id,
      dateOfBirth: '1985-08-22',
      gender: 'female',
      bloodGroup: 'O+',
      address: '456 Oak Avenue, Los Angeles, CA 90001',
      emergencyContact: '+1234567897',
      medicalHistory: 'Asthma',
      allergies: 'Penicillin'
    });
    console.log('✅ Patient profile created for Jane Smith\n');

    // ============================================
    // CREATE APPOINTMENTS
    // ============================================
    console.log('Creating appointments...');
    
    await Appointment.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      appointmentDate: '2025-10-20',
      appointmentTime: '10:00:00',
      type: 'consultation',
      status: 'scheduled',
      reason: 'Regular checkup and blood pressure monitoring'
    });
    console.log('✅ Appointment created: John Doe with Dr. Sarah Johnson');

    await Appointment.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      appointmentDate: '2025-10-21',
      appointmentTime: '14:00:00',
      type: 'follow_up',
      status: 'scheduled',
      reason: 'Follow-up visit for hypertension'
    });
    console.log('✅ Appointment created: John Doe follow-up');

    await Appointment.create({
      patientId: patient2.id,
      doctorId: doctor2.id,
      appointmentDate: '2025-10-20',
      appointmentTime: '11:00:00',
      type: 'consultation',
      status: 'scheduled',
      reason: 'Knee pain consultation'
    });
    console.log('✅ Appointment created: Jane Smith with Dr. Michael Brown\n');

    // ============================================
    // CREATE MEDICAL RECORDS
    // ============================================
    console.log('Creating medical records...');
    
    await MedicalRecord.create({
      patientId: patient1.id,
      doctorId: doctor1.id,
      diagnosis: 'Hypertension (Stage 1)',
      symptoms: 'High blood pressure, occasional headaches',
      prescription: 'Amlodipine 5mg once daily, Lifestyle modifications',
      labTests: 'Blood pressure monitoring, ECG',
      treatmentNotes: 'Monitor blood pressure regularly. Follow up in 2 weeks. Reduce sodium intake.',
      followUpDate: '2025-11-01'
    });
    console.log('✅ Medical record created for John Doe');

    await MedicalRecord.create({
      patientId: patient2.id,
      doctorId: doctor2.id,
      diagnosis: 'Knee Osteoarthritis',
      symptoms: 'Joint pain, stiffness, reduced mobility',
      prescription: 'Ibuprofen 400mg as needed, Physical therapy',
      labTests: 'X-Ray knee joint',
      treatmentNotes: 'Physical therapy recommended. Avoid strenuous activities. Use ice pack for pain relief.',
      followUpDate: '2025-11-05'
    });
    console.log('✅ Medical record created for Jane Smith\n');

    // ============================================
    // CREATE BILLS
    // ============================================
    console.log('Creating bills...');
    
    await Bill.create({
      patientId: patient1.id,
      invoiceNumber: 'INV-202510-0001',
      totalAmount: 250.00,
      paidAmount: 250.00,
      balanceAmount: 0.00,
      status: 'paid',
      billDate: new Date(),
      dueDate: '2025-10-30',
      services: [
        { name: 'Consultation', quantity: 1, price: 150 },
        { name: 'Lab Test - Blood Pressure', quantity: 1, price: 100 }
      ],
      paymentMethod: 'card'
    });
    console.log('✅ Bill created for John Doe (Paid)');

    await Bill.create({
      patientId: patient2.id,
      invoiceNumber: 'INV-202510-0002',
      totalAmount: 500.00,
      paidAmount: 0.00,
      balanceAmount: 500.00,
      status: 'pending',
      billDate: new Date(),
      dueDate: '2025-10-25',
      services: [
        { name: 'Consultation', quantity: 1, price: 120 },
        { name: 'X-Ray', quantity: 1, price: 380 }
      ]
    });
    console.log('✅ Bill created for Jane Smith (Pending)\n');

    // ============================================
    // CREATE INVENTORY
    // ============================================
    console.log('Creating inventory items...');
    
    await Inventory.create({
      itemName: 'Paracetamol 500mg',
      category: 'medicine',
      quantity: 500,
      minQuantity: 50,
      unitPrice: 0.50,
      supplier: 'PharmaCorp',
      expiryDate: '2026-12-31',
      batchNumber: 'BATCH-001',
      description: 'Pain relief and fever reducer'
    });
    console.log('✅ Inventory item added: Paracetamol');

    await Inventory.create({
      itemName: 'Surgical Gloves (Box of 100)',
      category: 'supplies',
      quantity: 200,
      minQuantity: 100,
      unitPrice: 2.50,
      supplier: 'MedSupply Inc',
      expiryDate: '2027-06-30',
      batchNumber: 'BATCH-002',
      description: 'Latex-free surgical gloves'
    });
    console.log('✅ Inventory item added: Surgical Gloves');

    await Inventory.create({
      itemName: 'Insulin Injection 100IU/ml',
      category: 'medicine',
      quantity: 30,
      minQuantity: 20,
      unitPrice: 15.00,
      supplier: 'PharmaCorp',
      expiryDate: '2025-12-31',
      batchNumber: 'BATCH-003',
      description: 'Insulin for diabetes management'
    });
    console.log('✅ Inventory item added: Insulin');

    await Inventory.create({
      itemName: 'Face Masks (Box of 50)',
      category: 'supplies',
      quantity: 1000,
      minQuantity: 200,
      unitPrice: 0.25,
      supplier: 'SafetyFirst',
      expiryDate: '2026-12-31',
      batchNumber: 'BATCH-004',
      description: '3-ply disposable face masks'
    });
    console.log('✅ Inventory item added: Face Masks');

    await Inventory.create({
      itemName: 'Blood Pressure Monitor',
      category: 'equipment',
      quantity: 15,
      minQuantity: 5,
      unitPrice: 150.00,
      supplier: 'MediTech',
      batchNumber: 'EQUIP-001',
      description: 'Digital blood pressure monitoring device'
    });
    console.log('✅ Inventory item added: Blood Pressure Monitor\n');

    console.log('════════════════════════════════════════════════════════');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('════════════════════════════════════════════════════════\n');
    
    console.log('📧 DEMO LOGIN CREDENTIALS:');
    console.log('────────────────────────────────────────────────────────');
    console.log('Admin:   admin@hospital.com          | password123');
    console.log('Doctor:  doctor@hospital.com         | password123');
    console.log('Doctor:  michael.brown@hospital.com  | password123');
    console.log('Nurse:   nurse@hospital.com          | password123');
    console.log('Patient: patient@hospital.com        | password123');
    console.log('Patient: jane.smith@hospital.com     | password123');
    console.log('────────────────────────────────────────────────────────\n');

    console.log('📊 DATA SUMMARY:');
    console.log('────────────────────────────────────────────────────────');
    console.log('✅ Users: 6');
    console.log('✅ Doctors: 2');
    console.log('✅ Patients: 2');
    console.log('✅ Appointments: 3');
    console.log('✅ Medical Records: 2');
    console.log('✅ Bills: 2');
    console.log('✅ Inventory Items: 5');
    console.log('────────────────────────────────────────────────────────\n');

    console.log('🚀 You can now start the frontend and login!');
    console.log('   Frontend: npm run dev (in frontend folder)');
    console.log('   Access: http://localhost:5173\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ SEEDING ERROR:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
