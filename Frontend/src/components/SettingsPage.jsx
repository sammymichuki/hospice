import React, { useState } from 'react';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    language: 'english',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    systemAlerts: true,
    marketingEmails: false,
    
    // Privacy Settings
    profileVisibility: 'organization',
    showEmail: false,
    showPhone: true,
    dataSharing: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAlerts: true
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const sections = [
    { id: 'general', label: 'General', icon: 'fa-cog' },
    { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
    { id: 'privacy', label: 'Privacy', icon: 'fa-user-shield' },
    { id: 'security', label: 'Security', icon: 'fa-lock' },
    { id: 'billing', label: 'Billing', icon: 'fa-credit-card' },
    { id: 'integrations', label: 'Integrations', icon: 'fa-plug' }
  ];

  const integrations = [
    { name: 'Google Calendar', icon: '📅', status: 'connected', color: 'green' },
    { name: 'Zoom', icon: '🎥', status: 'disconnected', color: 'gray' },
    { name: 'Slack', icon: '💬', status: 'connected', color: 'green' },
    { name: 'Microsoft Teams', icon: '👥', status: 'disconnected', color: 'gray' }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-6">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className={`fas ${section.icon}`}></i>
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">General Settings</h2>
                  <p className="text-gray-600">Manage your general preferences</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSelectChange('language', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSelectChange('timezone', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="UTC-5">EST (UTC-5)</option>
                      <option value="UTC-6">CST (UTC-6)</option>
                      <option value="UTC-7">MST (UTC-7)</option>
                      <option value="UTC-8">PST (UTC-8)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleSelectChange('theme', theme)}
                          className={`p-4 border-2 rounded-lg capitalize transition ${
                            settings.theme === theme
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <i className={`fas fa-${theme === 'light' ? 'sun' : theme === 'dark' ? 'moon' : 'circle-half-stroke'} text-2xl mb-2`}></i>
                          <div className="font-medium">{theme}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Notification Preferences</h2>
                  <p className="text-gray-600">Choose how you want to be notified</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via text message' },
                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
                    { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Get reminders for upcoming appointments' },
                    { key: 'systemAlerts', label: 'System Alerts', desc: 'Receive important system updates' },
                    { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional content and updates' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.label}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-info-circle text-blue-600 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Notification Digest</h4>
                      <p className="text-sm text-blue-700">You can also receive a daily digest of all notifications at 8:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Privacy Settings</h2>
                  <p className="text-gray-600">Control your privacy and data sharing</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) => handleSelectChange('profileVisibility', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="public">Public - Everyone can see</option>
                      <option value="organization">Organization - Only colleagues</option>
                      <option value="private">Private - Only me</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'showEmail', label: 'Show Email Address', desc: 'Display your email on your profile' },
                      { key: 'showPhone', label: 'Show Phone Number', desc: 'Display your phone on your profile' },
                      { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymized data for research' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.label}</h4>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleToggle(item.key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition flex items-center justify-between">
                        <span className="font-medium text-gray-800">Download My Data</span>
                        <i className="fas fa-download text-blue-600"></i>
                      </button>
                      <button className="w-full text-left px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center justify-between">
                        <span className="font-medium">Delete My Account</span>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Security Settings</h2>
                  <p className="text-gray-600">Keep your account secure</p>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-shield-alt text-green-600 text-2xl"></i>
                      <div>
                        <h4 className="font-semibold text-green-900">Security Score: Strong</h4>
                        <p className="text-sm text-green-700">Your account is well protected</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <button
                        onClick={() => handleToggle('twoFactorAuth')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">Login Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                      </div>
                      <button
                        onClick={() => handleToggle('loginAlerts')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          settings.loginAlerts ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            settings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSelectChange('sessionTimeout', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="never">Never</option>
                    </select>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <i className="fas fa-desktop text-gray-600"></i>
                              <span className="font-medium text-gray-800">Current Session</span>
                              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">Active</span>
                            </div>
                            <p className="text-sm text-gray-600">Chrome on Windows • New York, USA</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <i className="fas fa-mobile-alt text-gray-600"></i>
                              <span className="font-medium text-gray-800">Mobile Device</span>
                            </div>
                            <p className="text-sm text-gray-600">iPhone • Last active 2 hours ago</p>
                          </div>
                          <button className="text-red-600 hover:text-red-700 font-medium text-sm">Revoke</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition border border-red-200">
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Log Out of All Devices
                  </button>
                </div>
              </div>
            )}

            {/* Billing Settings */}
            {activeSection === 'billing' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Billing & Subscription</h2>
                  <p className="text-gray-600">Manage your subscription and payment methods</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 border-2 border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-blue-900">Professional Plan</h3>
                        <p className="text-blue-700">$99/month</p>
                      </div>
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Current Plan</span>
                    </div>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p>✓ Unlimited patients</p>
                      <p>✓ Advanced analytics</p>
                      <p>✓ Priority support</p>
                      <p>✓ API access</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <i className="fab fa-cc-visa text-3xl text-blue-600"></i>
                          <div>
                            <p className="font-medium text-gray-800">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-600">Expires 12/2025</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">Default</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Edit</button>
                      </div>
                      <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-gray-600 hover:text-blue-600 font-medium">
                        <i className="fas fa-plus mr-2"></i>Add Payment Method
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing History</h3>
                    <div className="space-y-2">
                      {[
                        { date: 'Nov 1, 2024', amount: '$99.00', status: 'Paid' },
                        { date: 'Oct 1, 2024', amount: '$99.00', status: 'Paid' },
                        { date: 'Sep 1, 2024', amount: '$99.00', status: 'Paid' }
                      ].map((invoice, index) => (
                        <div key={index} className="p-4 border rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{invoice.date}</p>
                            <p className="text-sm text-gray-600">Professional Plan</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-800">{invoice.amount}</span>
                            <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">{invoice.status}</span>
                            <button className="text-blue-600 hover:text-blue-700">
                              <i className="fas fa-download"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeSection === 'integrations' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Integrations</h2>
                  <p className="text-gray-600">Connect with your favorite tools and services</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {integrations.map((integration, index) => (
                    <div key={index} className="p-6 border rounded-lg hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{integration.icon}</div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{integration.name}</h3>
                            <p className={`text-sm ${integration.status === 'connected' ? 'text-green-600' : 'text-gray-500'}`}>
                              {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {integration.status === 'connected' ? (
                          <button className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition text-sm font-medium">
                            Disconnect
                          </button>
                        ) : (
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                            Connect
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Sync your appointments and meetings seamlessly
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <i className="fas fa-puzzle-piece text-4xl text-gray-400 mb-3"></i>
                    <h3 className="font-semibold text-gray-800 mb-2">Need More Integrations?</h3>
                    <p className="text-sm text-gray-600 mb-4">Contact us to request new integrations</p>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                      Request Integration
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t flex gap-4">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                <i className="fas fa-save mr-2"></i>Save Changes
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;