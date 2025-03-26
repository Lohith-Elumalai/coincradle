import React, { useState, useEffect, useContext } from 'react';
import FinanceDataContext from '../../contexts/FinanceDataContext';
import { PieChart } from '../ui/PieChart';

const CategoryBreakdown = ({ categories, month }) => {
  const { transactions } = useContext(FinanceDataContext);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTransactions, setCategoryTransactions] = useState([]);

  // Process category data for the pie chart
  useEffect(() => {
    if (categories && categories.length > 0) {
      // Map categories with colors for the chart
      const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
        '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4'
      ];
      
      const data = categories.map((category, index) => ({
        name: category.name,
        value: category.spent || 0,
        color: colors[index % colors.length],
        limit: category.limit,
        percentage: category.spent ? ((category.spent / category.limit) * 100).toFixed(1) : '0.0'
      }));
      
      setCategoryData(data);
    }
  }, [categories]);

  // Filter transactions for the selected category
  useEffect(() => {
    if (selectedCategory && transactions.length > 0) {
      // Filter transactions for the current month and selected category
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === month.getMonth() &&
          transactionDate.getFullYear() === month.getFullYear() &&
          transaction.category.toLowerCase() === selectedCategory.name.toLowerCase()
        );
      });
      
      setCategoryTransactions(filteredTransactions);
    } else {
      setCategoryTransactions([]);
    }
  }, [selectedCategory, transactions, month]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-lg font-medium text-gray-800">Spending by Category</h2>
      
      {categoryData.length > 0 ? (
        <>
          <div className="mb-4 h-48">
            <PieChart 
              data={categoryData} 
              nameKey="name" 
              valueKey="value" 
              onClick={(data) => setSelectedCategory(data)}
            />
          </div>
          
          <div className="mb-6 space-y-2">
            {categoryData.map((category) => (
              <div 
                key={category.name} 
                className={`flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-50 ${
                  selectedCategory?.name === category.name ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="flex items-center">
                  <div 
                    className="mr-2 h-3 w-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">${category.value.toFixed(2)}</span>
                  <span className={`ml-2 text-xs ${
                    parseFloat(category.percentage) >= 100 
                      ? 'text-red-600' 
                      : parseFloat(category.percentage) >= 90 
                        ? 'text-orange-600' 
                        : 'text-gray-500'
                  }`}>
                    ({category.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {selectedCategory && (
            <div>
              <h3 className="mb-2 font-medium text-gray-800">
                {selectedCategory.name} Transactions
              </h3>
              
              {categoryTransactions.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {categoryTransactions.map((transaction) => (
                      <li key={transaction.id} className="py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                          </div>
                          <p className="text-sm font-medium">
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No transactions found for this category.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2 text-center text-gray-600">No spending data available for this period</p>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;