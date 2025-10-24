import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Users,
  Calendar,
  DollarSign,
  Package,
  FileText,
  UserPlus,
  LogOut,
  Menu,
  X,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = {
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Patients', path: '/patients' },
      { icon: UserPlus, label: 'Doctors', path: '/doctors' },
      { icon: Users, label: 'Staff', path: '/staff' },
      { icon: Calendar, label: 'Appointments', path: '/appointments' },
      { icon: FileText, label: 'Records', path: '/records' },
      { icon: DollarSign, label: 'Billing', path: '/billing' },
      { icon: Package, label: 'Inventory', path: '/inventory' },
    ],
    doctor: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'My Patients', path: '/patients' },
      { icon: Calendar, label: 'Appointments', path: '/appointments' },
      { icon: FileText, label: 'Medical Records', path: '/records' },
      { icon: DollarSign, label: 'Billing', path: '/billing' },
    ],
    nurse: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Patients', path: '/patients' },
      { icon: Calendar, label: 'Appointments', path: '/appointments' },
      { icon: FileText, label: 'Patient Charts', path: '/records' },
      { icon: Package, label: 'Inventory', path: '/inventory' },
    ],
    patient: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Calendar, label: 'Appointments', path: '/appointments' },
      { icon: FileText, label: 'Medical Records', path: '/records' },
      { icon: DollarSign, label: 'My Bills', path: '/billing' },
      { icon: Settings, label: 'Profile', path: '/profile' },
    ],
  };

  const items = menuItems[user?.role] || [];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-blue-700">
          {isOpen && (
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8" />
              <h2 className="text-xl font-bold">HMS</h2>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Info */}
        {isOpen && user && (
          <div className="p-4 border-b border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-lg font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-xs text-blue-200 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-700 text-white'
                  : 'hover:bg-blue-800 text-blue-100'
              }`}
              title={!isOpen ? item.label : ''}
            >
              <item.icon size={20} />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors text-blue-100"
            title={!isOpen ? 'Logout' : ''}
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 lg:hidden z-30 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Menu size={24} />
      </button>
    </>
  );
};

export default Sidebar;