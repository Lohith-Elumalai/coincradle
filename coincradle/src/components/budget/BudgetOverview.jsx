import React from 'react';
import { PieChart } from '../ui/PieChart';

const BudgetOverview = ({ budget }) => {
  // Calculate totals and percentages
  const totalBudget = budget.amount;
  const totalSpent = budget.spent || 0;
  const remaining = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;
  
  // Determine status based on spending
  const getStatus = () => {
    if (spentPercentage >= 100) {
      return { label: 'Over Budget', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (spentPercentage >= 90) {
      return { label: 'Near Limit', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    } else if (spentPercentage >= 75) {
      return { label: 'On Track', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else {
      return { label: 'Under Budget', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  };
  
  const status = getStatus();

  // Prepare data for pie chart
  const pieData = [
    { name: 'Spent', value: totalSpent, color: '#3B82F6' },
    { name: 'Remaining', value: remaining > 0 ? remaining : 0, color: '#E5E7EB' }
  ];

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-800">Monthly Budget Overview</h2>
        <div className={`rounded-full ${status.bgColor} px-3 py-1`}>
          <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">${totalBudget.toFixed(2)}</p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Spent</p>
              <p className="text-sm font-medium text-gray-900">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div 
                className={`h-full rounded-full ${
                  spentPercentage >= 100 
                    ? 'bg-red-500' 
                    : spentPercentage >= 90 
                      ? 'bg-orange-500' 
                      : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Remaining</p>
              <p className={`text-sm font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${remaining.toFixed(2)}
              </p>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {remaining < 0 
                ? `${Math.abs(spentPercentage - 100).toFixed(1)}% over budget` 
                : `${(remaining / totalBudget * 100).toFixed(1)}% of budget remaining`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="h-48 w-48">
            <PieChart data={pieData} nameKey="name" valueKey="value" />
          </div>
        </div>
      </div>
      
      {/* Categories Summary */}
      <div className="mt-6">
        <h3 className="mb-3 text-lg font-medium text-gray-800">Category Summary</h3>
        <div className="space-y-3">
          {budget.categories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">{category.name}</p>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    ${category.spent?.toFixed(2) || '0.00'} / ${category.limit.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {((category.spent || 0) / category.limit * 100).toFixed(0)}% used
                  </p>
                </div>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div 
                  className={`h-full rounded-full ${
                    (category.spent || 0) >= category.limit 
                      ? 'bg-red-500' 
                      : (category.spent || 0) >= category.limit * 0.9 
                        ? 'bg-orange-500' 
                        : (category.spent || 0) >= category.limit * 0.75
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(((category.spent || 0) / category.limit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;