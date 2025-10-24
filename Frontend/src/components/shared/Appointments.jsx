import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar as CalendarIcon, X } from 'lucide-react';
import Table from '../common/Table';
import { appointmentsAPI, doctorsAPI, patientsAPI } from '../../services/api';
import { formatDate, formatTime, getStatusColor } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    type: 'consultation',
    reason: '',
  });

  useEffect(() => {
    fetchAppointments();
    if (user.role === 'admin' || user.role === 'patient') {
      fetchDoctors();
    }
    if (user.role === 'admin') {
      fetchPatients();
    }
  }, [pagination.page]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAll({
        page: pagination.page,
        limit: 10,
      });
      setAppointments(response.data.data.appointments);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll({ limit: 100 });
      setDoctors(response.data.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientsAPI.getAll({ limit: 100 });
      setPatients(response.data.data.patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentsAPI.create(formData);
      setShowModal(false);
      fetchAppointments();
      setFormData({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        type: 'consultation',
        reason: '',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert(error.response?.data?.message || 'Failed to create appointment');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentsAPI.cancel(id);
        fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const columns = [
    {
      header: 'Patient',
      accessor: 'patient',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.patient?.user?.name || 'N/A'}</p>
          <p className="text-sm text-gray-500">{row.patient?.user?.email}</p>
        </div>
      ),
    },
    {
      header: 'Doctor',
      accessor: 'doctor',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.doctor?.user?.name || 'N/A'}</p>
          <p className="text-sm text-gray-500">{row.doctor?.specialization}</p>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{formatDate(row.appointmentDate)}</p>
          <p className="text-sm text-gray-500">{formatTime(row.appointmentTime)}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <span className="capitalize">{row.type}</span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleCancel(row.id)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
            disabled={row.status === 'cancelled'}
          >
            Cancel
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 mt-1">Manage and schedule appointments</p>
        </div>
        {(user.role === 'patient' || user.role === 'admin') && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Book Appointment
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search appointments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={appointments}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {user.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient
                  </label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.user?.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.user?.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                  <option value="checkup">Checkup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the reason for this appointment..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;