# Hospital Management System - Backend API

A comprehensive RESTful API for managing hospital operations including patient records, appointments, billing, inventory, and staff management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend folder**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up MySQL database**
```bash
# Log into MySQL
mysql -u root -p

# Create database
CREATE DATABASE hospital_management;
exit;
```

4. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Required environment variables:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_management
JWT_SECRET=your_secret_key
```

5. **Run the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require JWT token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile (Protected)
- `PUT /profile` - Update user profile (Protected)
- `PUT /change-password` - Change password (Protected)

#### Patients (`/api/patients`)
- `GET /` - Get all patients (Admin, Doctor, Nurse)
- `GET /stats` - Get patient statistics (Admin)
- `GET /:id` - Get patient by ID
- `POST /` - Create new patient (Admin)
- `PUT /:id` - Update patient (Admin, Doctor, Nurse)
- `DELETE /:id` - Delete patient (Admin)

#### Doctors (`/api/doctors`)
- `GET /` - Get all doctors
- `GET /available` - Get available doctors
- `GET /:id` - Get doctor by ID
- `GET /:id/schedule` - Get doctor schedule
- `POST /` - Create new doctor (Admin)
- `PUT /:id` - Update doctor (Admin, Doctor)
- `PUT /:id/schedule` - Update doctor schedule (Admin, Doctor)
- `DELETE /:id` - Delete doctor (Admin)

#### Appointments (`/api/appointments`)
- `GET /` - Get all appointments
- `GET /today` - Get today's appointments
- `GET /stats` - Get appointment statistics (Admin, Doctor)
- `GET /:id` - Get appointment by ID
- `POST /` - Create new appointment
- `PUT /:id` - Update appointment
- `PUT /:id/cancel` - Cancel appointment

#### Medical Records (`/api/records`)
- `GET /` - Get all medical records
- `GET /:id` - Get record by ID
- `GET /patient/:patientId/history` - Get patient history
- `POST /` - Create medical record (Admin, Doctor)
- `PUT /:id` - Update medical record (Admin, Doctor)
- `DELETE /:id` - Delete medical record (Admin)

#### Billing (`/api/bills`)
- `GET /` - Get all bills
- `GET /stats` - Get billing statistics (Admin)
- `GET /:id` - Get bill by ID
- `POST /` - Create new bill (Admin, Doctor)
- `PUT /:id` - Update bill (Admin)
- `POST /:id/payment` - Process payment
- `DELETE /:id` - Delete bill (Admin)

#### Inventory (`/api/inventory`)
- `GET /` - Get all inventory items
- `GET /stats` - Get inventory statistics (Admin)
- `GET /low-stock` - Get low stock items
- `GET /expired` - Get expired items
- `GET /expiring-soon` - Get items expiring soon
- `GET /:id` - Get item by ID
- `POST /` - Create new item (Admin)
- `PUT /:id` - Update item (Admin)
- `PUT /:id/stock` - Update stock quantity (Admin, Nurse)
- `DELETE /:id` - Delete item (Admin)

## 🔐 User Roles & Permissions

### Admin
- Full access to all endpoints
- Manage users, doctors, nurses, patients
- View all records and statistics
- Manage billing and inventory

### Doctor
- View assigned patients
- Create and update medical records
- View and manage appointments
- Create bills

### Nurse
- View patients
- Update patient charts
- Update inventory stock

### Patient
- View own records
- Book and manage appointments
- View own bills

## 📦 Database Models

### User
- id, name, email, password, role, phone, status

### Patient
- id, userId, dateOfBirth, gender, bloodGroup, address, emergencyContact, medicalHistory, allergies

### Doctor
- id, userId, specialization, qualification, experience, licenseNumber, consultationFee, schedule, availability

### Appointment
- id, patientId, doctorId, appointmentDate, appointmentTime, type, status, reason, notes

### MedicalRecord
- id, patientId, doctorId, visitDate, diagnosis, symptoms, prescription, labTests, treatmentNotes, followUpDate

### Bill
- id, patientId, invoiceNumber, totalAmount, paidAmount, balanceAmount, status, billDate, dueDate, services, paymentMethod

### Inventory
- id, itemName, category, quantity, minQuantity, unitPrice, supplier, expiryDate, batchNumber, status

## 🧪 Testing with Postman

1. Import the `postman_collection.json` file into Postman
2. Set the `base_url` variable to `http://localhost:5000`
3. Login using the login endpoint
4. Copy the returned token
5. Set the `token` variable in Postman
6. Start testing other endpoints!

### Default Test Accounts

```
Admin:
Email: admin@hospital.com
Password: password123

Doctor:
Email: doctor@hospital.com
Password: password123

Nurse:
Email: nurse@hospital.com
Password: password123

Patient:
Email: patient@hospital.com
Password: password123
```

## 🛠️ Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── patientController.js
│   ├── doctorController.js
│   ├── appointmentController.js
│   ├── recordController.js
│   ├── billController.js
│   └── inventoryController.js
├── middleware/
│   └── auth.js              # JWT authentication
├── models/
│   ├── User.js
│   ├── Patient.js
│   ├── Doctor.js
│   ├── Appointment.js
│   ├── MedicalRecord.js
│   ├── Bill.js
│   └── Inventory.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── patients.js
│   ├── doctors.js
│   ├── appointments.js
│   ├── records.js
│   ├── bills.js
│   └── inventory.js
├── .env
├── .env.example
├── package.json
└── server.js
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control (RBAC)
- SQL injection prevention with Sequelize ORM
- CORS protection
- Environment variable configuration

## 📝 Notes

- The API uses Sequelize ORM which will auto-create tables on first run
- Make sure MySQL is running before starting the server
- Default passwords should be changed in production
- Keep your JWT_SECRET secure and never commit it to version control

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

ISC