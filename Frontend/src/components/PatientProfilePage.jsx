import React, { useState } from 'react';

const PatientProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 987-6543',
    dateOfBirth: '1990-03-15',
    gender: 'Female',
    bloodGroup: 'O+',
    address: '456 Wellness Street, Apt 12B',
    city: 'Boston',
    state: 'MA',
    zipCode: '02108',
    emergencyContactName: 'Michael Johnson',
    emergencyContactPhone: '+1 (555) 123-9876',
    emergencyContactRelation: 'Spouse',
    insuranceProvider: 'Blue Cross Blue Shield',
    insuranceId: 'BCBS-1234567890',
    allergies: 'Penicillin, Peanuts',
    chronicConditions: 'Type 2 Diabetes, Hypertension',
    currentMedications: 'Metformin 500mg, Lisinopril 10mg',
    notes: 'Patient prefers morning appointments. Requires wheelchair access.'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const healthStats = [
    { label: 'Total Visits', value: '24', icon: 'fa-hospital', color: 'blue' },
    { label: 'Appointments', value: '8', icon: 'fa-calendar-check', color: 'green' },
    { label: 'Prescriptions', value: '12', icon: 'fa-prescription-bottle', color: 'purple' },
    { label: 'Lab Tests', value: '15', icon: 'fa-flask', color: 'orange' }
  ];

  const upcomingAppointments = [
    { doctor: 'Dr. Emily Parker', specialty: 'Endocrinologist', date: 'Nov 15, 2024', time: '10:00 AM', type: 'Follow-up' },
    { doctor: 'Dr. Robert Chen', specialty: 'Cardiologist', date: 'Nov 22, 2024', time: '2:30 PM', type: 'Check-up' },
    { doctor: 'Dr. Lisa Brown', specialty: 'General Physician', date: 'Dec 5, 2024', time: '9:00 AM', type: 'Consultation' }
  ];

  const recentActivity = [
    { action: 'Lab test results received', time: '2 days ago', icon: 'fa-file-medical', color: 'green' },
    { action: 'Prescription refilled', time: '1 week ago', icon: 'fa-pills', color: 'blue' },
    { action: 'Appointment completed with Dr. Parker', time: '2 weeks ago', icon: 'fa-check-circle', color: 'purple' },
    { action: 'Blood pressure reading recorded', time: '3 weeks ago', icon: 'fa-heartbeat', color: 'red' }
  ];

  const vitalSigns = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', icon: 'fa-heartbeat' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', icon: 'fa-heart-pulse' },
    { label: 'Temperature', value: '98.6', unit: '°F', status: 'normal', icon: 'fa-temperature-half' },
    { label: 'Weight', value: '165', unit: 'lbs', status: 'normal', icon: 'fa-weight-scale' }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Health Profile</h1>
        <p className="text-gray-600">Manage your personal health information and medical records</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center text-5xl">
                👤
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition shadow-lg">
                <i className="fas fa-camera"></i>
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-gray-600 mb-2">Patient ID: PT-{Math.floor(Math.random() * 100000)}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  <i className="fas fa-tint mr-1"></i>{profileData.bloodGroup}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                  <i className="fas fa-shield-alt mr-1"></i>Insured
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                  <i className="fas fa-user-check mr-1"></i>Verified
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                isEditing 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} mr-2`}></i>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Health Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {healthStats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition">
                <i className={`fas ${stat.icon} text-2xl text-${stat.color}-600 mb-2`}></i>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('personal')}
                className={`pb-3 px-4 font-medium transition whitespace-nowrap ${
                  activeTab === 'personal'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-user mr-2"></i>Personal Info
              </button>
              <button
                onClick={() => setActiveTab('medical')}
                className={`pb-3 px-4 font-medium transition whitespace-nowrap ${
                  activeTab === 'medical'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-heartbeat mr-2"></i>Medical Info
              </button>
              <button
                onClick={() => setActiveTab('emergency')}
                className={`pb-3 px-4 font-medium transition whitespace-nowrap ${
                  activeTab === 'emergency'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-phone-alt mr-2"></i>Emergency
              </button>
              <button
                onClick={() => setActiveTab('insurance')}
                className={`pb-3 px-4 font-medium transition whitespace-nowrap ${
                  activeTab === 'insurance'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-id-card mr-2"></i>Insurance
              </button>
            </div>

            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={profileData.bloodGroup}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>O+</option>
                      <option>O-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={profileData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={profileData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Medical Info Tab */}
            {activeTab === 'medical' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <textarea
                    name="allergies"
                    value={profileData.allergies}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    placeholder="List any known allergies..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                  <textarea
                    name="chronicConditions"
                    value={profileData.chronicConditions}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    placeholder="List any chronic health conditions..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                  <textarea
                    name="currentMedications"
                    value={profileData.currentMedications}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    placeholder="List current medications and dosages..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={profileData.notes}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    placeholder="Any additional medical information..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Important Medical Information
                  </h4>
                  <p className="text-sm text-yellow-700">Always keep your medical information up-to-date. This information is critical for emergency situations and proper medical care.</p>
                </div>
              </div>
            )}

            {/* Emergency Contact Tab */}
            {activeTab === 'emergency' && (
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                    <i className="fas fa-ambulance mr-2"></i>
                    Emergency Contact Information
                  </h4>
                  <p className="text-sm text-red-700">This person will be contacted in case of medical emergencies</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={profileData.emergencyContactName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={profileData.emergencyContactPhone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                  <select
                    name="emergencyContactRelation"
                    value={profileData.emergencyContactRelation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option>Spouse</option>
                    <option>Parent</option>
                    <option>Sibling</option>
                    <option>Child</option>
                    <option>Friend</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Insurance Tab */}
            {activeTab === 'insurance' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={profileData.insuranceProvider}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance ID Number</label>
                  <input
                    type="text"
                    name="insuranceId"
                    value={profileData.insuranceId}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <i className="fas fa-info-circle mr-2"></i>
                    Insurance Card
                  </h4>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-white border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-blue-600 font-medium">
                      <i className="fas fa-upload mr-2"></i>Upload Insurance Card (Front)
                    </button>
                    <button className="w-full px-4 py-3 bg-white border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-blue-600 font-medium">
                      <i className="fas fa-upload mr-2"></i>Upload Insurance Card (Back)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-4 mt-6 pt-6 border-t">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  <i className="fas fa-save mr-2"></i>Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Vital Signs */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Latest Vital Signs</h3>
              <span className="text-sm text-gray-500">Last updated: 2 days ago</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {vitalSigns.map((vital, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <i className={`fas ${vital.icon} text-2xl text-blue-600`}></i>
                      <span className="font-medium text-gray-700">{vital.label}</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                      {vital.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {vital.value} <span className="text-sm text-gray-500 font-normal">{vital.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
              Upcoming Appointments
            </h3>
            <div className="space-y-4">
              {upcomingAppointments.map((apt, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{apt.doctor}</h4>
                      <p className="text-sm text-gray-600">{apt.specialty}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs rounded-full">
                      {apt.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-700 mt-2">
                    <span><i className="fas fa-calendar mr-1"></i>{apt.date}</span>
                    <span><i className="fas fa-clock mr-1"></i>{apt.time}</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-gray-600 hover:text-blue-600 font-medium">
                <i className="fas fa-plus mr-2"></i>Book New Appointment
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-history mr-2 text-purple-600"></i>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className={`w-8 h-8 rounded-full bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                    <i className={`fas ${activity.icon} text-${activity.color}-600 text-sm`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-3">
                <i className="fas fa-file-medical text-blue-600"></i>
                <span className="font-medium text-gray-800">View Medical Records</span>
              </button>
              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition flex items-center gap-3">
                <i className="fas fa-prescription text-green-600"></i>
                <span className="font-medium text-gray-800">Request Prescription Refill</span>
              </button>
              <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition flex items-center gap-3">
                <i className="fas fa-download text-purple-600"></i>
                <span className="font-medium text-gray-800">Download Health Summary</span>
              </button>
              <button className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition flex items-center gap-3">
                <i className="fas fa-comment-medical text-orange-600"></i>
                <span className="font-medium text-gray-800">Message My Doctor</span>
              </button>
            </div>
          </div>

          {/* Health Tips */}
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <i className="fas fa-lightbulb text-3xl"></i>
              <h3 className="text-lg font-bold">Health Tip of the Day</h3>
            </div>
            <p className="text-green-50 leading-relaxed">
              Stay hydrated! Drink at least 8 glasses of water daily to maintain optimal health and support your medication effectiveness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;