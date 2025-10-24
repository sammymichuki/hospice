import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, trend, color = 'bg-blue-600', loading = false }) => {
  const colorClasses = {
    'bg-blue-600': 'bg-blue-600',
    'bg-green-600': 'bg-green-600',
    'bg-purple-600': 'bg-purple-600',
    'bg-orange-600': 'bg-orange-600',
    'bg-red-600': 'bg-red-600',
    'bg-indigo-600': 'bg-indigo-600',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="w-16 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
        <div className="w-32 h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color] || color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && trend !== null && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
              trend >= 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatCard;