import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Download } from 'lucide-react';
import Table from '../common/Table';
import { billsAPI } from '../../services/api';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const Billing = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  useEffect(() => {
    fetchBills();
  }, [pagination.page, filterStatus]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
      };
      if (filterStatus) params.status = filterStatus;

      const response = await billsAPI.getAll(params);
      setBills(response.data.data.bills);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Invoice #',
      render: (row) => (
        <span className="font-mono font-semibold text-gray-900">{row.invoiceNumber}</span>
      ),
    },
    {
      header: 'Patient',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.patient?.user?.name}</p>
          <p className="text-sm text-gray-500">{row.patient?.user?.email}</p>
        </div>
      ),
    },
    {
      header: 'Amount',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{formatCurrency(row.totalAmount)}</p>
          {row.balanceAmount > 0 && (
            <p className="text-sm text-orange-600">Due: {formatCurrency(row.balanceAmount)}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Date',
      render: (row) => (
        <div>
          <p className="text-gray-900">{formatDate(row.billDate)}</p>
          {row.dueDate && (
            <p className="text-sm text-gray-500">Due: {formatDate(row.dueDate)}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Payment Method',
      render: (row) => (
        <span className="capitalize">{row.paymentMethod || 'Not paid'}</span>
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
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
            title="Download"
          >
            <Download size={16} />
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
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-500 mt-1">Manage payments and invoices</p>
        </div>
        {user.role === 'admin' && (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            Create Invoice
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoices..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">$485,000</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Pending</p>
          <p className="text-2xl font-bold text-orange-600">$45,200</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Paid This Month</p>
          <p className="text-2xl font-bold text-green-600">$125,000</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Overdue</p>
          <p className="text-2xl font-bold text-red-600">$8,500</p>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={bills}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
      />
    </div>
  );
};

export default Billing;