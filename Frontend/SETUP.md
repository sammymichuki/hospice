# 🏥 Hospital Management System - Complete Setup Guide

This guide will walk you through setting up the entire Hospital Management System from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## 🚀 Step-by-Step Installation

### Step 1: Create Project Structure

```bash
# Create main project folder
mkdir hospital-management-system
cd hospital-management-system

# Create backend and frontend folders
mkdir backend frontend
```

### Step 2: Backend Setup

#### 2.1 Initialize Backend

```bash
cd backend
npm init -y
```

#### 2.2 Install Backend Dependencies

```bash
npm install express mysql2 sequelize bcryptjs jsonwebtoken dotenv cors express-validator
npm install --save-dev nodemon
```

#### 2.3 Create Backend Files

Create all the backend files provided in the artifacts:
- `server.js`
- `config/database.js`
- `middleware/auth.js`
- `models/` (All 7 model files)
- `controllers/` (All 7 controller files)
- `routes/` (All 8 route files)

#### 2.4 Configure Environment

```bash
# Create .env file
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_management
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

#### 2.5 Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE hospital_management;
exit;
```

#### 2.6 Update package.json Scripts

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

#### 2.7 Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Database connection established successfully.
✅ Database models synchronized.
🚀 Server is running on port 5000
📍 API: http://localhost:5000/api
```

### Step 3: Frontend Setup

Open a new terminal window:

#### 3.1 Create React App with Vite

```bash
cd ../frontend
npm create vite@latest . -- --template react
```

#### 3.2 Install Frontend Dependencies

```bash
npm install
npm install react-router-dom axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 3.3 Create Frontend Files

Create all the frontend files provided in the artifacts:
- `src/App.jsx`
- `src/main.jsx`
- `src/index.css`
- `src/context/AuthContext.jsx`
- `src/services/api.js`
- `src/utils/helpers.js`
- `src/components/` (All component files)
- `vite.config.js`
- `tailwind.config.js`
- `index.html`

#### 3.4 Configure Tailwind

Update `tailwind.config.js` with the provided configuration.

#### 3.5 Configure Environment

```bash
# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### 3.6 Start Frontend Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🎯 Testing the Application

### 1. Access the Application

Open your browser and navigate to: `http://localhost:5173`

### 2. Login with Demo Accounts

The system comes with these demo accounts:

**Admin:**
- Email: `admin@hospital.com`
- Password: `password123`

**Doctor:**
- Email: `doctor@hospital.com`
- Password: `password123`

**Nurse:**
- Email: `nurse@hospital.com`
- Password: `password123`

**Patient:**
- Email: `patient@hospital.com`
- Password: `password123`

### 3. Test Core Features

#### As Admin:
- ✅ View dashboard statistics
- ✅ Manage patients
- ✅ Manage doctors
- ✅ View all appointments
- ✅ Manage billing
- ✅ Manage inventory

#### As Doctor:
- ✅ View today's schedule
- ✅ View assigned patients
- ✅ Create medical records
- ✅ Manage appointments

#### As Patient:
- ✅ Book appointments
- ✅ View medical records
- ✅ View and pay bills
- ✅ Update profile

## 🔧 Development Workflow

### Running Both Servers Simultaneously

**Option 1: Two Terminal Windows**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Option 2: Using Concurrently (Recommended)**
```bash
# In root directory
npm install -D concurrently

# Add to root package.json
"scripts": {
  "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
  "start": "concurrently \"cd backend && npm start\" \"cd frontend && npm start\""
}

# Run both servers
npm run dev
```

## 📊 Database Management

### View Database Tables

```bash
mysql -u root -p
use hospital_management;
show tables;
```

### Reset Database

```bash
# Drop and recreate
DROP DATABASE hospital_management;
CREATE DATABASE hospital_management;

# Restart backend server to recreate tables
```

### Add Sample Data

Use the Postman collection to add sample data via API endpoints.

## 🧪 Testing with Postman

1. Import `postman_collection.json` into Postman
2. Set environment variables:
   - `base_url`: `http://localhost:5000`
   - `token`: (will be set after login)
3. Test endpoints in this order:
   - Authentication
   - Patients
   - Doctors
   - Appointments
   - Medical Records
   - Billing
   - Inventory

## 🐛 Common Issues & Solutions

### Issue 1: Backend won't start
**Error:** `Cannot connect to MySQL`
**Solution:**
```bash
# Check MySQL is running
sudo service mysql status

# Start MySQL
sudo service mysql start

# Verify credentials in .env
```

### Issue 2: Frontend can't connect to backend
**Error:** `Network Error` or `CORS`
**Solution:**
```javascript
// backend/server.js - Check CORS config
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### Issue 3: Tables not created
**Solution:**
```javascript
// In server.js, change to force sync (CAUTION: Deletes data)
await sequelize.sync({ force: true });
```

### Issue 4: JWT errors
**Solution:**
- Check JWT_SECRET is set in .env
- Clear localStorage in browser
- Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Issue 5: Port already in use
**Solution:**
```bash
# Kill process on port 5000
sudo lsof -t -i tcp:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

## 🚀 Production Deployment

### Backend Deployment (e.g., Railway, Render)

1. **Update environment variables:**
```env
NODE_ENV=production
DB_HOST=your-production-db-host
JWT_SECRET=strong-production-secret
```

2. **Build command:** `npm install`
3. **Start command:** `npm start`

### Frontend Deployment (e.g., Vercel, Netlify)

1. **Build:**
```bash
npm run build
```

2. **Environment variables:**
```env
VITE_API_URL=https://your-backend-api.com/api
```

3. **Deploy `dist` folder**

## 📝 Project Structure Summary

```
hospital-management-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎓 Next Steps

1. ✅ **Customize**: Modify components and styling to match your needs
2. ✅ **Add Features**: Implement remaining modules (lab tests, pharmacy)
3. ✅ **Security**: Add rate limiting, input validation
4. ✅ **Testing**: Write unit and integration tests
5. ✅ **Documentation**: Create API documentation with Swagger
6. ✅