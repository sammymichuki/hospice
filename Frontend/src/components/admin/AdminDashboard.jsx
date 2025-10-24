import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import StatCard from '../common/StatCard';
import { patientsAPI, appointmentsAPI, billsAPI } from '../../services/api';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [patientStats, setPatientStats] = useState(null);
  const [billingStats, setBillingStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [patientsRes, appointmentsRes, billsRes, appointmentStatsRes] = await Promise.all([
        patientsAPI.getStats(),
        appointmentsAPI.getToday(),
        billsAPI.getStats(),
        appointmentsAPI.getStats(),
      ]);

      // Set stats
      setStats({
        totalPatients: patientsRes.data.data.totalPatients,
        totalDoctors: 45, // You can add a doctors stats endpoint
        totalAppointments: appointmentStatsRes.data.data.totalAppointments,
        totalRevenue: billsRes.data.data.totalRevenue,
      });

      setPatientStats(patientsRes.data.data);
      setBillingStats(billsRes.data.data);
      setRecentAppointments(appointmentsRes.data.data.slice(0, 5));
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
          title="Total Patients"
          value={stats.totalPatients}
          trend={5}
          color="bg-blue-600"
          loading={loading}
        />
        <StatCard
          icon={UserPlus}
          title="Total Doctors"
          value={stats.totalDoctors}
          trend={2}
          color="bg-green-600"
          loading={loading}
        />
        <StatCard
          icon={Calendar}
          title="Appointments"
          value={stats.totalAppointments}
          trend={-3}
          color="bg-purple-600"
          loading={loading}
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          trend={12}
          color="bg-orange-600"
          loading={loading}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Today's Appointments</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentAppointments.length > 0 ? (
            <div className="space-y-3">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.patient?.user?.name || 'Unknown Patient'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.appointmentTime} - {appointment.doctor?.user?.name || 'Unknown Doctor'}
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
              No appointments scheduled for today
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Active Patients</span>
                <span className="font-bold text-gray-900">{patientStats?.activePatients || 0}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Today's Appointments</span>
                <span className="font-bold text-gray-900">{recentAppointments.length}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Pending Bills</span>
                <span className="font-bold text-orange-600">{billingStats?.pendingBills || 0}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Available Beds</span>
                <span className="font-bold text-green-600">45</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Low Stock Items</span>
                <span className="font-bold text-red-600">8</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-2" />
              <p>Revenue chart will be displayed here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Patient Demographics</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Male Patients</span>
                  <span className="text-sm font-medium">{patientStats?.malePatients || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        ((patientStats?.malePatients || 0) / (patientStats?.totalPatients || 1)) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Female Patients</span>
                  <span className="text-sm font-medium">{patientStats?.femalePatients || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pink-600 h-2 rounded-full"
                    style={{
                      width: `${
                        ((patientStats?.femalePatients || 0) / (patientStats?.totalPatients || 1)) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;