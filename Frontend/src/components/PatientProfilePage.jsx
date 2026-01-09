import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PatientProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientId, setPatientId] = useState(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
    gender: '', bloodGroup: '', address: '', city: '', state: '', zipCode: '',
    emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '',
    insuranceProvider: '', insuranceId: '', allergies: '', chronicConditions: '',
    currentMedications: '', notes: ''
  });

  const [healthStats, setHealthStats] = useState([
    { label: 'Total Visits', value: '0', icon: 'fa-hospital', color: 'blue' },
    { label: 'Appointments', value: '0', icon: 'fa-calendar-check', color: 'green' },
    { label: 'Prescriptions', value: '0', icon: 'fa-prescription-bottle', color: 'purple' },
    { label: 'Lab Tests', value: '0', icon: 'fa-flask', color: 'orange' }
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);

  const API_URL = 'http://localhost:5000/api'; // Backend API URL

  useEffect(() => {
    if (!authLoading) {
      if (user && user.role === 'patient' && user.patientProfile) {
        setPatientId(user.patientProfile.id);
        fetchPatientData(user.patientProfile.id);
        setProfileData({
          firstName: user.name || '',
          lastName: '', // Assuming lastName is not directly in user object, will need to confirm backend
          email: user.email || '',
          phone: user.phone || '',
          dateOfBirth: user.patientProfile.dateOfBirth?.split('T')[0] || '',
          gender: user.patientProfile.gender || '',
          bloodGroup: user.patientProfile.bloodGroup || '',
          address: user.patientProfile.address || '',
          emergencyContactName: user.patientProfile.emergencyContactName || '', // Assuming these fields
          emergencyContactPhone: user.patientProfile.emergencyContactPhone || '', // exist in patientProfile
          emergencyContactRelation: user.patientProfile.emergencyContactRelation || '', //
          allergies: user.patientProfile.allergies || '',
          chronicConditions: user.patientProfile.medicalHistory || '', // Assuming medicalHistory maps to chronicConditions
          currentMedications: '', // Not directly available in current patientProfile, need to check backend
          notes: '' // Not directly available
        });
      } else {
        setError('Patient profile not found or user is not a patient.');
        setLoading(false);
      }
    }
  }, [authLoading, user]);

  const fetchPatientData = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const [profileRes, statsRes, appointmentsRes, activityRes, vitalsRes] = await Promise.all([
        fetch(`${API_URL}/patients/${id}`, { headers }),
        fetch(`${API_URL}/patients/${id}/stats`, { headers }),
        fetch(`${API_URL}/patients/${id}/appointments`, { headers }),
        fetch(`${API_URL}/patients/${id}/activity`, { headers }),
        fetch(`${API_URL}/patients/${id}/vitals`, { headers })
      ]);

      if (!profileRes.ok) throw new Error('Failed to fetch profile');
      
      const profile = await profileRes.json();
      const stats = statsRes.ok ? await statsRes.json() : {};
      const appointments = appointmentsRes.ok ? await appointmentsRes.json() : [];
      const activity = activityRes.ok ? await activityRes.json() : [];
      const vitals = vitalsRes.ok ? await vitalsRes.json() : [];

      setProfileData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth?.split('T')[0] || '',
        gender: profile.gender || '',
        bloodGroup: profile.bloodGroup || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zipCode || '',
        emergencyContactName: profile.emergencyContactName || '',
        emergencyContactPhone: profile.emergencyContactPhone || '',
        emergencyContactRelation: profile.emergencyContactRelation || '',
        insuranceProvider: profile.insuranceProvider || '',
        insuranceId: profile.insuranceId || '',
        allergies: profile.allergies || '',
        chronicConditions: profile.chronicConditions || '',
        currentMedications: profile.currentMedications || '',
        notes: profile.notes || ''
      });

      setHealthStats([
        { label: 'Total Visits', value: stats.totalVisits?.toString() || '0', icon: 'fa-hospital', color: 'blue' },
        { label: 'Appointments', value: stats.appointments?.toString() || '0', icon: 'fa-calendar-check', color: 'green' },
        { label: 'Prescriptions', value: stats.prescriptions?.toString() || '0', icon: 'fa-prescription-bottle', color: 'purple' },
        { label: 'Lab Tests', value: stats.labTests?.toString() || '0', icon: 'fa-flask', color: 'orange' }
      ]);

      setUpcomingAppointments(appointments);
      setRecentActivity(activity);
      setVitalSigns(vitals);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setIsEditing(false);
      setLoading(false);
      alert('Profile updated successfully!');
      fetchPatientData(patientId);
    } catch (err) {
      setLoading(false);
      alert('Failed to update profile: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  if (loading && !profileData.firstName) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <style>{`@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');`}</style>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Health Profile</h1>
        <p className="text-gray-600">Manage your personal health information</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center text-5xl">👤</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-gray-600 mb-2">Patient ID: {patientId}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  <i className="fas fa-tint mr-1"></i>{profileData.bloodGroup || 'N/A'}
                </span>
              </div>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className={`px-6 py-3 rounded-lg font-medium ${isEditing ? 'bg-gray-200' : 'bg-blue-600 text-white'}`}>
              <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} mr-2`}></i>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {healthStats.map((stat, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                <i className={`fas ${stat.icon} text-2xl text-${stat.color}-600 mb-2`}></i>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex gap-4 border-b mb-6">
              {['personal', 'medical', 'emergency', 'insurance'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-4 font-medium ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input type="text" name="firstName" value={profileData.firstName} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input type="text" name="lastName" value={profileData.lastName} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" name="email" value={profileData.email} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Allergies</label>
                  <textarea name="allergies" value={profileData.allergies} onChange={handleInputChange} disabled={!isEditing} rows="3" className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Chronic Conditions</label>
                  <textarea name="chronicConditions" value={profileData.chronicConditions} onChange={handleInputChange} disabled={!isEditing} rows="3" className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100" />
                </div>
              </div>
            )}

            {isEditing && (
              <div className="flex gap-4 mt-6 pt-6 border-t">
                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-3 rounded-lg">Save Changes</button>
                <button onClick={() => setIsEditing(false)} className="px-6 py-3 border rounded-lg">Cancel</button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Upcoming Appointments</h3>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? upcomingAppointments.map((apt, i) => (
                <div key={i} className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold">{apt.doctorName}</h4>
                  <p className="text-sm text-gray-600">{apt.specialty}</p>
                  <p className="text-sm mt-2">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                </div>
              )) : <p className="text-gray-500">No upcoming appointments</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;