import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import Table from '../common/Table';
import { inventoryAPI } from '../../services/api';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const Inventory = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    fetchInventory();
    fetchLowStockCount();
  }, [pagination.page, filterCategory, filterStatus]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
      };
      if (filterCategory) params.category = filterCategory;
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;

      const response = await inventoryAPI.getAll(params);
      setItems(response.data.data.items);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockCount = async () => {
    try {
      const response = await inventoryAPI.getLowStock();
      setLowStockCount(response.data.data.length);
    } catch (error) {
      console.error('Error fetching low stock count:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryAPI.delete(id);
        fetchInventory();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const columns = [
    {
      header: 'Item Name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.itemName}</p>
          <p className="text-sm text-gray-500">Batch: {row.batchNumber || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (row) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm capitalize">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Quantity',
      render: (row) => (
        <div>
          <p className={`font-semibold ${
            row.quantity <= row.minQuantity ? 'text-red-600' : 'text-gray-900'
          }`}>
            {row.quantity}
          </p>
          <p className="text-xs text-gray-500">Min: {row.minQuantity}</p>
        </div>
      ),
    },
    {
      header: 'Unit Price',
      render: (row) => <span className="font-medium">${row.unitPrice}</span>,
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
      render: (row) => row.supplier || 'N/A',
    },
    {
      header: 'Expiry Date',
      render: (row) => (
        <div>
          <p className={`${
            new Date(row.expiryDate) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-900'
          }`}>
            {formatDate(row.expiryDate)}
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Manage medicines and medical supplies</p>
        </div>
        {user.role === 'admin' && (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            Add Item
          </button>
        )}
      </div>

      {/* Alert for Low Stock */}
      {lowStockCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="text-orange-600" size={24} />
          <div>
            <p className="font-semibold text-orange-900">Low Stock Alert</p>
            <p className="text-sm text-orange-700">
              {lowStockCount} item(s) are running low on stock. Please reorder soon.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="medicine">Medicine</option>
            <option value="equipment">Equipment</option>
            <option value="supplies">Supplies</option>
            <option value="consumables">Consumables</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Low Stock</p>
          <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">3</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Value</p>
          <p className="text-2xl font-bold text-green-600">$85,420</p>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={items}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
      />
    </div>
  );
};

export default Inventory;