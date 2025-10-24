import React, { useState, useEffect } from 'react';
import { Users, Calendar, FileText, Clock } from 'lucide-react';
import StatCard from '../common/StatCard';
import { appointmentsAPI, patientsAPI } from '../../services/api';
import { formatTime, getStatusColor } from '../../utils/helpers';

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayPatients: 0,
    totalPatients: 0,
    upcomingAppointments: 0,
    completedToday: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes] = await Promise.all([
        appointmentsAPI.getToday(),
      ]);

      const appointments = appointmentsRes.data.data;
      setTodayAppointments(appointments);

      // Calculate stats
      setStats({
        todayPatients: appointments.length,
        totalPatients: 156, // This would come from a doctor-specific endpoint
        upcomingAppointments: appointments.filter(a => a.status === 'scheduled').length,
        completedToday: appointments.filter(a => a.status === 'completed').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Today's Patients"
          value={stats.todayPatients}
          color="bg-blue-600"
          loading={loading}
        />
        <StatCard
          icon={Calendar}
          title="Total Patients"
          value={stats.totalPatients}
          color="bg-green-600"
          loading={loading}
        />
        <StatCard
          icon={Clock}
          title="Upcoming"
          value={stats.upcomingAppointments}
          color="bg-purple-600"
          loading={loading}
        />
        <StatCard
          icon={FileText}
          title="Completed Today"
          value={stats.completedToday}
          color="bg-orange-600"
          loading={loading}
        />
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Today's Schedule</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4 p-4 border-b border-gray-100">
                  <div className="w-20 h-20 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center min-w-[80px] bg-blue-50 rounded-lg p-3">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatTime(appointment.appointmentTime).split(':')[0]}
                    </span>
                    <span className="text-xs text-blue-600">
                      {formatTime(appointment.appointmentTime).split(' ')[1]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {appointment.patient?.user?.name || 'Unknown Patient'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appointment.type} - {appointment.reason || 'General consultation'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        Start Consultation
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        View Records
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No appointments scheduled for today
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="font-medium text-blue-700">Add Medical Record</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <span className="font-medium text-green-700">View My Patients</span>
              <Users className="w-5 h-5 text-green-600" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <span className="font-medium text-purple-700">My Schedule</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Pending Tasks</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                5 Reports to review
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                3 Prescriptions to approve
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                2 Follow-ups due
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;