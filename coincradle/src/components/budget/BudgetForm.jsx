import React, { useState, useEffect, useContext } from 'react';
import FinanceDataContext from '../../contexts/FinanceDataContext';

const BudgetForm = ({ initialData, onSave, onCancel, month }) => {
  const { transactions } = useContext(FinanceDataContext);
  const [budget, setBudget] = useState({
    amount: 0,
    categories: []
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    limit: 0
  });
  const [error, setError] = useState('');

  // Suggested categories based on transaction history
  const [suggestedCategories, setSuggestedCategories] = useState([]);

  // Initialize form with data if available
  useEffect(() => {
    if (initialData) {
      setBudget({
        amount: initialData.amount || 0,
        categories: initialData.categories || []
      });
    }
  }, [initialData]);

  // Generate suggested categories from transaction history
  useEffect(() => {
    if (transactions.length > 0) {
      // Count transaction categories
      const categoryCounts = {};
      transactions.forEach(transaction => {
        if (transaction.category) {
          if (!categoryCounts[transaction.category]) {
            categoryCounts[transaction.category] = 0;
          }
          categoryCounts[transaction.category] += Math.abs(transaction.amount);
        }
      });
      
      // Convert to array and sort by frequency
      const sortedCategories = Object.entries(categoryCounts)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10); // Top 10 categories
      
      setSuggestedCategories(sortedCategories);
    }
  }, [transactions]);

  // Update total budget amount
  const handleBudgetAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setBudget(prev => ({
      ...prev,
      amount: value
    }));
  };

  // Update category input fields
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: name === 'limit' ? (parseFloat(value) || 0) : value
    }));
  };

  // Add a new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    if (newCategory.limit <= 0) {
      setError('Category limit must be greater than zero');
      return;
    }
    
    if (budget.categories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
      setError('Category already exists');
      return;
    }
    
    setBudget(prev => ({
      ...prev,
      categories: [...prev.categories, { ...newCategory }]
    }));
    
    setNewCategory({
      name: '',
      limit: 0
    });
    
    setError('');
  };

  // Update an existing category
  const handleUpdateCategory = (index, field, value) => {
    const updatedCategories = [...budget.categories];
    updatedCategories[index][field] = field === 'limit' ? (parseFloat(value) || 0) : value;
    
    setBudget(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  // Remove a category
  const handleRemoveCategory = (index) => {
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  // Add a suggested category
  const handleAddSuggested = (category) => {
    if (budget.categories.some(cat => cat.name.toLowerCase() === category.name.toLowerCase())) {
      setError('Category already exists');
      return;
    }
    
    setBudget(prev => ({
      ...prev,
      categories: [...prev.categories, { name: category.name, limit: category.amount }]
    }));
  };

  // Calculate remaining budget
  const allocatedBudget = budget.categories.reduce((sum, cat) => sum + cat.limit, 0);
  const remainingBudget = budget.amount - allocatedBudget;

  // Save the budget
  const handleSave = () => {
    if (budget.amount <= 0) {
      setError('Total budget amount must be greater than zero');
      return;
    }
    
    if (budget.categories.length === 0) {
      setError('At least one category is required');
      return;
    }
    
    onSave(budget);
  };

  // Format month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {initialData ? 'Edit' : 'Create'} Budget for {formatMonthYear(month)}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700">
          Total Monthly Budget
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500">$</span>
          </div>
          <input
            type="number"
            id="budgetAmount"
            value={budget.amount}
            onChange={handleBudgetAmountChange}
            min="0"
            step="0.01"
            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0.00"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800">Budget Categories</h3>
        <p className="text-sm text-gray-500">
          Allocate your budget across different spending categories
        </p>
      </div>
      
      <div className="mb-6 space-y-4">
        {budget.categories.map((category, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={category.name}
                onChange={(e) => handleUpdateCategory(index, 'name', e.target.value)}
                className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Category Name"
              />
            </div>
            <div className="w-32">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  value={category.limit}
                  onChange={(e) => handleUpdateCategory(index, 'limit', e.target.value)}
                  min="0"
                  step="0.01"
                  className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveCategory(index)}
              className="text-red-600 hover:text-red-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="name"
              value={newCategory.name}
              onChange={handleCategoryChange}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g. Groceries, Rent, Transportation"
            />
          </div>
          <div className="w-32">
            <label htmlFor="categoryLimit" className="block text-sm font-medium text-gray-700">
              Limit
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                id="categoryLimit"
                name="limit"
                value={newCategory.limit}
                onChange={handleCategoryChange}
                min="0"
                step="0.01"
                className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddCategory}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
      
      {suggestedCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Suggested Categories</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedCategories
              .filter(cat => !budget.categories.some(
                budgetCat => budgetCat.name.toLowerCase() === cat.name.toLowerCase()
              ))
              .map((category, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAddSuggested(category)}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200"
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>
      )}
      
      <div className="mb-6 rounded-lg bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-700">Total Budget</span>
          <span className="font-medium text-blue-900">${budget.amount.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-700">Allocated</span>
          <span className="font-medium text-blue-900">${allocatedBudget.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-blue-200 pt-2">
          <span className="text-sm font-medium text-blue-700">Remaining</span>
          <span className={`font-medium ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${remainingBudget.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save Budget
        </button>
      </div>
    </div>
  );
};

export default BudgetForm;
