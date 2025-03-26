import React from 'react';
import { PieChart, LineChart, DataTable } from '../ui';

const InvestmentPortfolio = ({ investments, totalValue, totalReturn }) => {
  // Calculate allocation by asset type for pie chart
  const assetAllocation = calculateAssetAllocation(investments);
  // Get performance history for line chart
  const performanceHistory = getPerformanceHistory(investments);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Table columns definition
  const columns = [
    {
      key: 'name',
      label: 'Investment',
      render: (row) => (
        <div className="flex items-center">
          <div
            className="mr-3 h-3 w-3 rounded-full"
            style={{ backgroundColor: getAssetTypeColor(row.assetType) }}
          ></div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-xs text-gray-500">{row.assetType}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'currentValue',
      label: 'Current Value',
      render: (row) => (
        <div className="text-right font-medium">
          {formatCurrency(row.currentValue)}
        </div>
      ),
    },
    {
      key: 'initialInvestment',
      label: 'Initial Investment',
      render: (row) => (
        <div className="text-right text-gray-600">
          {formatCurrency(row.initialInvestment)}
        </div>
      ),
    },
    {
      key: 'return',
      label: 'Return',
      render: (row) => {
        const returnAmount = row.currentValue - row.initialInvestment;
        const returnPercentage = (returnAmount / row.initialInvestment) * 100;
        const isPositive = returnAmount >= 0;
        
        return (
          <div className={`text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(returnAmount)}
            <div className="text-xs">
              {formatPercentage(returnPercentage)}
            </div>
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button className="rounded p-1 text-blue-600 hover:bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button className="rounded p-1 text-red-600 hover:bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-800">Total Value</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-800">Total Return</h3>
          <p className={`mt-2 text-3xl font-bold ${totalReturn.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalReturn.value)}
          </p>
          <p className={`text-lg ${totalReturn.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercentage(totalReturn.percentage)}
          </p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-800">Number of Investments</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{investments.length}</p>
        </div>
      </div>

      {/* Asset Allocation and Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-medium text-gray-800">Asset Allocation</h3>
          <div className="h-64">
            <PieChart
              data={assetAllocation}
              nameKey="assetType"
              valueKey="value"
              colors={assetAllocation.map(item => item.color)}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {assetAllocation.map((asset, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: asset.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {asset.assetType}: {((asset.value / totalValue) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-medium text-gray-800">Performance History</h3>
          <div className="h-64">
            <LineChart
              data={performanceHistory}
              xKey="date"
              yKey="value"
              height={250}
            />
          </div>
        </div>
      </div>

      {/* Investments Table */}
      <div className="rounded-lg bg-white shadow-lg">
        <h3 className="border-b border-gray-200 p-6 pb-4 text-lg font-medium text-gray-800">
          Your Investments
        </h3>
        <DataTable
          data={investments}
          columns={columns}
          pagination={true}
          pageSize={5}
        />
      </div>
    </div>
  );
};

// Helper functions
const calculateAssetAllocation = (investments) => {
  const assetTypes = {};
  
  investments.forEach(investment => {
    if (!assetTypes[investment.assetType]) {
      assetTypes[investment.assetType] = 0;
    }
    assetTypes[investment.assetType] += investment.currentValue;
  });
  
  return Object.keys(assetTypes).map(assetType => ({
    assetType,
    value: assetTypes[assetType],
    color: getAssetTypeColor(assetType)
  }));
};

const getPerformanceHistory = (investments) => {
  // This would typically come from API
  // For now, generate some sample data
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return months.map((month, index) => {
    // Generate some random performance data
    const value = investments.reduce((total, investment) => {
      // Simulate some growth trend
      const monthFactor = 1 + ((index + 1) * 0.01) + (Math.random() * 0.02 - 0.01);
      return total + (investment.initialInvestment * monthFactor);
    }, 0);
    
    return {
      date: month,
      value
    };
  });
};

const getAssetTypeColor = (assetType) => {
  const colors = {
    'Stocks': '#3B82F6', // Blue
    'Bonds': '#10B981', // Green
    'ETFs': '#8B5CF6', // Purple
    'Mutual Funds': '#F59E0B', // Yellow
    'Real Estate': '#EF4444', // Red
    'Crypto': '#EC4899', // Pink
    'Cash': '#6B7280', // Gray
    'Other': '#1F2937', // Dark Gray
  };
  
  return colors[assetType] || '#6B7280';
};

export default InvestmentPortfolio;
