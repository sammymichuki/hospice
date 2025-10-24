# Hospital Management System - Frontend

A modern, responsive React-based frontend for the Hospital Management System built with Vite, React Router, Tailwind CSS, and Axios.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:5000

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── common/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── Table.jsx
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx
│   │   ├── doctor/
│   │   │   └── DoctorDashboard.jsx
│   │   ├── patient/
│   │   │   └── PatientDashboard.jsx
│   │   └── shared/
│   │       ├── Appointments.jsx
│   │       ├── Patients.jsx
│   │       ├── Billing.jsx
│   │       └── Inventory.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Features

### Authentication
- ✅ Login with role-based access
- ✅ User registration for patients
- ✅ JWT token management
- ✅ Protected routes
- ✅ Auto-logout on token expiry

### Dashboards
- **Admin Dashboard**
  - Overview statistics
  - Today's appointments
  - Patient demographics
  - Revenue tracking
  
- **Doctor Dashboard**
  - Today's schedule
  - Patient list
  - Quick actions
  - Pending tasks

- **Patient Dashboard**
  - Upcoming appointments
  - Medical records
  - Pending bills
  - Quick appointment booking

### Core Modules
- **Appointments**: Book, view, and manage appointments
- **Patients**: Patient records and management
- **Billing**: Invoice generation and payment tracking
- **Inventory**: Medical supplies and stock management

### UI/UX Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode ready
- ✅ Loading states and skeletons
- ✅ Error handling
- ✅ Toast notifications
- ✅ Search and filters
- ✅ Pagination
- ✅ Modern, clean interface

## 🔐 User Roles & Access

### Admin
- Full system access
- User management
- All reports and statistics

### Doctor
- View assigned patients
- Manage appointments
- Create medical records
- Generate bills

### Nurse
- View patients
- Update patient charts
- Manage inventory

### Patient
- Book appointments
- View own records
- Pay bills
- Manage profile

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📦 Dependencies

### Core
- **React** (^18.2.0) - UI library
- **React Router DOM** (^6.20.0) - Routing
- **Axios** (^1.6.2) - HTTP client

### UI
- **Tailwind CSS** (^3.3.6) - Utility-first CSS
- **Lucide React** (^0.294.0) - Icon library

### Dev Tools
- **Vite** (^5.0.8) - Build tool
- **ESLint** - Code linting

## 🎯 API Integration

The frontend communicates with the backend API using Axios. All API calls are centralized in `src/services/api.js`.

### API Configuration
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Authentication Flow
1. User logs in via `/api/auth/login`
2. JWT token stored in localStorage
3. Token automatically added to all subsequent requests
4. Auto-redirect to login on 401 responses

### Available API Services
- `authAPI` - Authentication endpoints
- `usersAPI` - User management
- `patientsAPI` - Patient operations
- `doctorsAPI` - Doctor management
- `appointmentsAPI` - Appointment booking
- `recordsAPI` - Medical records
- `billsAPI` - Billing operations
- `inventoryAPI` - Inventory management

## 🎨 Styling Guide

### Tailwind Configuration
The project uses Tailwind CSS with a custom configuration:

```javascript
// Primary colors
primary: {
  50: '#eff6ff',
  500: '#3b82f6',
  600: '#2563eb',
  900: '#1e3a8a',
}
```

### Common Patterns
```jsx
// Button
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">

// Card
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

// Input
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
```

## 🔧 Customization

### Adding New Routes
1. Create component in appropriate folder
2. Add route in `App.jsx`
3. Update sidebar menu items

### Creating New Components
1. Follow existing component structure
2. Use Tailwind for styling
3. Implement loading states
4. Add error handling

### API Integration
1. Add service methods in `api.js`
2. Use in components with try-catch
3. Handle loading and error states

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` folder.

### Deploy Options
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist` folder
- **AWS S3**: Upload `dist` contents
- **Docker**: Use provided Dockerfile

## 🐛 Troubleshooting

### CORS Issues
Make sure backend CORS is configured correctly:
```javascript
cors({ origin: 'http://localhost:5173' })
```

### API Connection Failed
1. Check backend is running
2. Verify API URL in `.env`
3. Check network tab in browser

### Build Errors
1. Clear node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Clear cache: `npm cache clean --force`

## 📝 Code Style

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

ISC

## 🙋 Support

For issues or questions, please create an issue in the repository.