import React, { useState } from 'react';

const MedicalRecordsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterDate, setFilterDate] = useState('all');

  const medicalRecords = [
    {
      id: 1,
      type: 'Lab Report',
      title: 'Complete Blood Count (CBC)',
      doctor: 'Dr. Emily Parker',
      date: '2024-11-05',
      status: 'Completed',
      category: 'lab',
      icon: 'fa-flask',
      color: 'purple',
      description: 'Routine blood work showing normal ranges for all parameters.',
      results: ['WBC: 7.2 K/uL (Normal)', 'RBC: 4.8 M/uL (Normal)', 'Hemoglobin: 14.2 g/dL (Normal)', 'Platelets: 250 K/uL (Normal)']
    },
    {
      id: 2,
      type: 'Prescription',
      title: 'Diabetes Management',
      doctor: 'Dr. Robert Chen',
      date: '2024-11-03',
      status: 'Active',
      category: 'prescription',
      icon: 'fa-prescription-bottle',
      color: 'blue',
      description: 'Medication for Type 2 Diabetes management.',
      medications: ['Metformin 500mg - Twice daily', 'Lisinopril 10mg - Once daily']
    },
    {
      id: 3,
      type: 'Visit Summary',
      title: 'Annual Physical Examination',
      doctor: 'Dr. Lisa Brown',
      date: '2024-10-28',
      status: 'Completed',
      category: 'visit',
      icon: 'fa-user-md',
      color: 'green',
      description: 'Annual checkup with comprehensive physical examination.',
      notes: ['Blood pressure: 120/80 mmHg', 'Weight: 165 lbs', 'Height: 5\'8"', 'Overall health: Good']
    },
    {
      id: 4,
      type: 'Imaging',
      title: 'Chest X-Ray',
      doctor: 'Dr. Michael Wong',
      date: '2024-10-20',
      status: 'Completed',
      category: 'imaging',
      icon: 'fa-x-ray',
      color: 'orange',
      description: 'Chest X-ray for routine screening.',
      findings: ['Clear lung fields', 'Normal heart size', 'No acute findings']
    },
    {
      id: 5,
      type: 'Lab Report',
      title: 'Lipid Panel',
      doctor: 'Dr. Emily Parker',
      date: '2024-10-15',
      status: 'Completed',
      category: 'lab',
      icon: 'fa-flask',
      color: 'purple',
      description: 'Cholesterol and lipid levels assessment.',
      results: ['Total Cholesterol: 185 mg/dL (Normal)', 'LDL: 110 mg/dL (Normal)', 'HDL: 55 mg/dL (Normal)', 'Triglycerides: 120 mg/dL (Normal)']
    },
    {
      id: 6,
      type: 'Vaccination',
      title: 'Flu Vaccine 2024',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-10-10',
      status: 'Completed',
      category: 'vaccination',
      icon: 'fa-syringe',
      color: 'teal',
      description: 'Annual influenza vaccination.',
      vaccine: 'Quadrivalent Influenza Vaccine'
    },
    {
      id: 7,
      type: 'Visit Summary',
      title: 'Cardiology Consultation',
      doctor: 'Dr. Robert Chen',
      date: '2024-09-25',
      status: 'Completed',
      category: 'visit',
      icon: 'fa-heartbeat',
      color: 'red',
      description: 'Follow-up consultation for hypertension management.',
      notes: ['Blood pressure well controlled', 'Continue current medications', 'Follow-up in 3 months']
    },
    {
      id: 8,
      type: 'Lab Report',
      title: 'HbA1c Test',
      doctor: 'Dr. Emily Parker',
      date: '2024-09-15',
      status: 'Completed',
      category: 'lab',
      icon: 'fa-flask',
      color: 'purple',
      description: 'Diabetes monitoring - 3-month average blood sugar.',
      results: ['HbA1c: 6.8% (Good control)', 'Target: <7%']
    }
  ];

  const stats = [
    { label: 'Total Records', value: medicalRecords.length, icon: 'fa-folder-open', color: 'blue' },
    { label: 'Lab Reports', value: medicalRecords.filter(r => r.category === 'lab').length, icon: 'fa-flask', color: 'purple' },
    { label: 'Prescriptions', value: medicalRecords.filter(r => r.category === 'prescription').length, icon: 'fa-prescription', color: 'green' },
    { label: 'Recent Visits', value: medicalRecords.filter(r => r.category === 'visit').length, icon: 'fa-hospital', color: 'orange' }
  ];

  const filteredRecords = medicalRecords.filter(record => {
    const matchesTab = activeTab === 'all' || record.category === activeTab;
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const recordDate = new Date(record.date);
      const now = new Date();
      if (filterDate === 'week') {
        matchesDate = (now - recordDate) / (1000 * 60 * 60 * 24) <= 7;
      } else if (filterDate === 'month') {
        matchesDate = (now - recordDate) / (1000 * 60 * 60 * 24) <= 30;
      } else if (filterDate === 'year') {
        matchesDate = (now - recordDate) / (1000 * 60 * 60 * 24) <= 365;
      }
    }
    
    return matchesTab && matchesSearch && matchesDate;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Records</h1>
        <p className="text-gray-600">Access and manage your complete medical history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-3`}>
              <i className={`fas ${stat.icon} text-${stat.color}-600 text-xl`}></i>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search records, doctors, or procedures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Records', icon: 'fa-folder' },
            { id: 'lab', label: 'Lab Reports', icon: 'fa-flask' },
            { id: 'prescription', label: 'Prescriptions', icon: 'fa-prescription' },
            { id: 'visit', label: 'Visits', icon: 'fa-user-md' },
            { id: 'imaging', label: 'Imaging', icon: 'fa-x-ray' },
            { id: 'vaccination', label: 'Vaccinations', icon: 'fa-syringe' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={`fas ${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r from-${record.color}-400 to-${record.color}-600`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${record.color}-100 rounded-lg flex items-center justify-center`}>
                    <i className={`fas ${record.icon} text-${record.color}-600 text-xl`}></i>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === 'Active' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {record.status}
                  </span>
                </div>

                <h3 className="font-bold text-gray-800 mb-2 text-lg">{record.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <i className="fas fa-user-md mr-2 text-blue-600"></i>
                  {record.doctor}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <i className="fas fa-calendar mr-2 text-purple-600"></i>
                  {formatDate(record.date)}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  <i className="fas fa-file-medical mr-2 text-green-600"></i>
                  {record.type}
                </p>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium text-sm">
                    <i className="fas fa-eye mr-2"></i>View
                  </button>
                  <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition">
                    <i className="fas fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <i className="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Records Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className={`p-6 bg-gradient-to-r from-${selectedRecord.color}-500 to-${selectedRecord.color}-600 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <i className={`fas ${selectedRecord.icon} text-3xl`}></i>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedRecord.title}</h2>
                      <p className="text-white/80">{selectedRecord.type}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Doctor</p>
                  <p className="font-semibold text-gray-800">{selectedRecord.doctor}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedRecord.date)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{selectedRecord.description}</p>
              </div>

              {selectedRecord.results && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">Results</h3>
                  <div className="space-y-2">
                    {selectedRecord.results.map((result, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <i className="fas fa-check-circle text-green-600"></i>
                        <span className="text-gray-700">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.medications && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">Medications</h3>
                  <div className="space-y-2">
                    {selectedRecord.medications.map((med, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <i className="fas fa-pills text-blue-600"></i>
                        <span className="text-gray-700">{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.notes && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">Notes</h3>
                  <div className="space-y-2">
                    {selectedRecord.notes.map((note, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-circle text-gray-400 text-xs"></i>
                        <span className="text-gray-700">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.findings && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">Findings</h3>
                  <div className="space-y-2">
                    {selectedRecord.findings.map((finding, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <i className="fas fa-check-circle text-green-600"></i>
                        <span className="text-gray-700">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.vaccine && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">Vaccine Details</h3>
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <p className="text-gray-700">{selectedRecord.vaccine}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  <i className="fas fa-download mr-2"></i>Download PDF
                </button>
                <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                  <i className="fas fa-print mr-2"></i>Print
                </button>
                <button className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium">
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Floating Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition flex items-center justify-center group">
        <i className="fas fa-plus text-2xl"></i>
        <div className="absolute bottom-20 right-0 bg-gray-800 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Request Records
        </div>
      </button>
    </div>
  );
};

export default MedicalRecordsPage;