import React, { useState, useEffect, useContext } from 'react';
import FinanceDataContext from '../contexts/FinanceDataContext';
import BudgetOverview from '../components/budget/BudgetOverview';
import CategoryBreakdown from '../components/budget/CategoryBreakdown';
import BudgetForm from '../components/budget/BudgetForm';
import BudgetRecommendations from '../components/budget/BudgetRecommendations';
import { aiService } from '../services/ai.service';

const Budget = () => {
  const { budgets, transactions, saveBudget, fetchBudgets, loading } = useContext(FinanceDataContext);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Find the current active budget when component mounts or budgets change
  useEffect(() => {
    if (budgets && budgets.length > 0) {
      // Find budget for current month
      const currentMonthBudget = budgets.find(budget => {
        const budgetDate = new Date(budget.month);
        return (
          budgetDate.getMonth() === currentMonth.getMonth() &&
          budgetDate.getFullYear() === currentMonth.getFullYear()
        );
      });
      
      setSelectedBudget(currentMonthBudget || null);
    }
  }, [budgets, currentMonth]);

  // Get AI budget recommendations if no budget exists
  useEffect(() => {
    const getRecommendations = async () => {
      if (!selectedBudget && transactions.length > 0 && !recommendations) {
        setLoadingRecommendations(true);
        try {
          const result = await aiService.generateBudgetPlan({
            transactions: transactions.slice(0, 100), // Last 100 transactions
            month: currentMonth.toISOString()
          });
          setRecommendations(result);
        } catch (err) {
          console.error('Error getting budget recommendations:', err);
        } finally {
          setLoadingRecommendations(false);
        }
      }
    };

    getRecommendations();
  }, [selectedBudget, transactions, recommendations, currentMonth]);

  // Handle month change
  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  // Handle budget creation/update
  const handleSaveBudget = async (budgetData) => {
    try {
      const saved = await saveBudget({
        ...budgetData,
        month: currentMonth.toISOString()
      });
      setSelectedBudget(saved);
      setShowBudgetForm(false);
      // Clear recommendations after creating a budget
      setRecommendations(null);
    } catch (err) {
      console.error('Error saving budget:', err);
      // Handle error
    }
  };

  // Format month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  // Set current month
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Budget Planning</h1>
        <button
          onClick={() => setShowBudgetForm(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {selectedBudget ? 'Edit Budget' : 'Create Budget'}
        </button>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
        <button
          onClick={goToPreviousMonth}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">{formatMonthYear(currentMonth)}</h2>
          {!selectedBudget && (
            <span className="text-sm text-gray-500">No budget set for this month</span>
          )}
        </div>
        
        <div className="flex items-center">
          <button
            onClick={goToCurrentMonth}
            className="mr-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Budget Overview */}
        <div className="lg:col-span-2">
          {loading.budgets ? (
            <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-md">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="ml-2 text-gray-600">Loading budget data...</p>
            </div>
          ) : selectedBudget ? (
            <BudgetOverview budget={selectedBudget} />
          ) : recommendations ? (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-medium text-gray-800">AI Budget Recommendations</h2>
              <p className="mb-4 text-gray-600">
                Based on your spending habits, we've created a personalized budget recommendation for you.
              </p>
              <BudgetRecommendations 
                recommendations={recommendations} 
                onApply={() => {
                  handleSaveBudget(recommendations);
                }} 
                onCustomize={() => {
                  setShowBudgetForm(true);
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h2 className="mt-4 text-xl font-medium text-gray-800">No Budget Set</h2>
              <p className="mt-2 text-center text-gray-600">
                You haven't set a budget for {formatMonthYear(currentMonth)}. Create one to track your spending and savings goals.
              </p>
              
              {loadingRecommendations ? (
                <div className="mt-4 flex items-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  <p className="ml-2 text-gray-600">Generating recommendations...</p>
                </div>
              ) : (
                <button
                  onClick={() => setShowBudgetForm(true)}
                  className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Create Budget
                </button>
              )}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-1">
          {selectedBudget ? (
            <CategoryBreakdown 
              categories={selectedBudget.categories} 
              month={currentMonth} 
            />
          ) : recommendations ? (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-medium text-gray-800">Recommended Categories</h2>
              <ul className="space-y-2">
                {recommendations.categories.map((category, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{category.name}</span>
                    <span className="font-medium text-gray-900">${category.limit.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-medium text-gray-800">Top Spending Categories</h2>
              {transactions.length > 0 ? (
                <p className="text-gray-600">
                  Create a budget to track your spending across different categories.
                </p>
              ) : (
                <p className="text-gray-600">
                  Connect your accounts to see your spending categories.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <BudgetForm
              initialData={selectedBudget || recommendations}
              onSave={handleSaveBudget}
              onCancel={() => setShowBudgetForm(false)}
              month={currentMonth}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;