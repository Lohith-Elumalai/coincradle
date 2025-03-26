import React from 'react';
import LineChart from "../ui/LineChart";
import PieChart from "../ui/PieChart";

const SpendingInsights = ({ trends, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse rounded-lg bg-white p-6 shadow-lg">
        <div className="h-6 w-48 rounded bg-gray-200"></div>
        <div className="mt-4 h-64 w-full rounded bg-gray-200"></div>
      </div>
    );
  }

  if (!trends) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Spending Insights</h2>
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Not enough data to generate insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Spending Insights</h2>
      
      <div className="mb-6">
        <h3 className="mb-2 font-medium text-gray-700">Monthly Spending Trend</h3>
        <LineChart 
          data={trends.monthlyTrend} 
          xKey="month" 
          yKey="amount" 
          height={200} 
        />
      </div>
      
      <div>
        <h3 className="mb-2 font-medium text-gray-700">Spending by Category</h3>
        <div className="flex h-48 items-center justify-center">
          <PieChart 
            data={trends.categoryBreakdown} 
            nameKey="category" 
            valueKey="amount" 
          />
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {trends.categoryBreakdown.map((category, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="mr-2 h-3 w-3 rounded-full" 
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-xs text-gray-600">
                {category.category}: ${category.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingInsights;