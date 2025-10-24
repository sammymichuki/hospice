import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import Table from '../common/Table';
import { patientsAPI } from '../../services/api';
import { calculateAge } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const Patients= () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  useEffect(() => {
    fetchPatients();
  }, [pagination.page, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientsAPI.getAll({
        page: pagination.page,
        limit: 10,
        search: searchTerm,
      });
      setPatients(response.data.data.patients);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientsAPI.delete(id);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient');
      }
    }
  };

  const columns = [
    {
      header: 'Patient Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {row.user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.user?.name}</p>
            <p className="text-sm text-gray-500">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Age',
      render: (row) => <span>{calculateAge(row.dateOfBirth)} years</span>,
    },
    {
      header: 'Gender',
      render: (row) => <span className="capitalize">{row.gender}</span>,
    },
    {
      header: 'Blood Group',
      accessor: 'bloodGroup',
      render: (row) => (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
          {row.bloodGroup || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Phone',
      render: (row) => row.user?.phone || 'N/A',
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row.user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {row.user?.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {user.role === 'admin' && (
            <>
              <button
                className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500 mt-1">Manage patient records and information</p>
        </div>
        {user.role === 'admin' && (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            Add Patient
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
            placeholder="Search patients by name, email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={patients}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
      />
    </div>
  );
};

export default Patients;