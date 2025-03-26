import React from 'react';

const BudgetRecommendations = ({ recommendations, onApply, onCustomize }) => {
  const { amount, categories } = recommendations;
  
  return (
    <div>
      <div className="mb-4 rounded-lg bg-blue-50 p-4">
        <p className="mb-2 text-sm font-medium text-blue-800">
          AI Recommendation
        </p>
        <p className="text-sm text-blue-700">
          Based on your spending patterns, we recommend a monthly budget of <span className="font-bold">${amount.toFixed(2)}</span>.
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Recommended Categories</h3>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <span className="font-medium text-gray-700">{category.name}</span>
              <span className="text-gray-900">${category.limit.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={onApply}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Apply Recommendations
        </button>
        <button
          onClick={onCustomize}
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Customize Budget
        </button>
      </div>
    </div>
  );
};

export default BudgetRecommendations;