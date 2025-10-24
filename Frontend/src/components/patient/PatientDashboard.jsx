import React, { useState, useEffect } from 'react';
import { Calendar, FileText, DollarSign, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../common/StatCard';
import { appointmentsAPI, recordsAPI, billsAPI } from '../../services/api';
import { formatDate, formatTime, formatCurrency, getStatusColor } from '../../utils/helpers';

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalRecords: 0,
    pendingBills: 0,
    lastVisit: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, recordsRes, billsRes] = await Promise.all([
        appointmentsAPI.getAll({ limit: 5 }),
        recordsAPI.getAll({ limit: 3 }),
        billsAPI.getAll({ status: 'pending', limit: 3 }),
      ]);

      const appointments = appointmentsRes.data.data.appointments || [];
      const records = recordsRes.data.data.records || [];
      const bills = billsRes.data.data.bills || [];

      setUpcomingAppointments(appointments.filter(a => a.status === 'scheduled'));
      setRecentRecords(records);
      setPendingBills(bills);

      setStats({
        upcomingAppointments: appointments.filter(a => a.status === 'scheduled').length,
        totalRecords: recordsRes.data.data.pagination?.total || records.length,
        pendingBills: bills.length,
        lastVisit: records[0]?.visitDate || null,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Your Health Dashboard</h1>
        <p className="text-blue-100">
          Stay on top of your health with easy access to appointments, records, and billing.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Calendar}
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          color="bg-blue-600"
          loading={loading}
        />
        <StatCard
          icon={FileText}
          title="Medical Records"
          value={stats.totalRecords}
          color="bg-green-600"
          loading={loading}
        />
        <StatCard
          icon={DollarSign}
          title="Pending Bills"
          value={stats.pendingBills}
          color="bg-orange-600"
          loading={loading}
        />
        <StatCard
          icon={Clock}
          title="Last Visit"
          value={stats.lastVisit ? formatDate(stats.lastVisit) : 'N/A'}
          color="bg-purple-600"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
            <Link
              to="/appointments"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Book Appointment
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center min-w-[70px] bg-blue-50 rounded-lg p-3">
                      <span className="text-lg font-bold text-blue-600">
                        {new Date(appointment.appointmentDate).getDate()}
                      </span>
                      <span className="text-xs text-blue-600">
                        {new Date(appointment.appointmentDate).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.doctor?.user?.name || 'Doctor'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatTime(appointment.appointmentTime)} - {appointment.type}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No upcoming appointments</p>
              <Link
                to="/appointments"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Book your first appointment
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          {/* Recent Records */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Records</h2>
              <Link to="/records" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : recentRecords.length > 0 ? (
              <div className="space-y-3">
                {recentRecords.map((record) => (
                  <div key={record.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="font-medium text-gray-900 text-sm mb-1">{record.diagnosis}</p>
                    <p className="text-xs text-gray-500">{formatDate(record.visitDate)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No records yet</p>
            )}
          </div>

          {/* Pending Bills */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Pending Bills</h2>
              <Link to="/billing" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : pendingBills.length > 0 ? (
              <div className="space-y-3">
                {pendingBills.map((bill) => (
                  <div key={bill.id} className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm">{bill.invoiceNumber}</p>
                      <span className="text-sm font-bold text-orange-600">
                        {formatCurrency(bill.balanceAmount)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Due: {formatDate(bill.dueDate)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No pending bills</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;