import React, { useState } from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getGreeting } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const Header = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, message: 'New appointment scheduled', time: '5 min ago', unread: true },
    { id: 2, message: 'Patient report ready', time: '1 hour ago', unread: true },
    { id: 3, message: 'Bill payment received', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {title || `${getGreeting()}, ${user?.name}`}
            </h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-4">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
            >
              <Settings size={20} className="text-gray-600" />
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    <User size={18} />
                    <span className="text-sm">My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    <Settings size={18} />
                    <span className="text-sm">Settings</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;