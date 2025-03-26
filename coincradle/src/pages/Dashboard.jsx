// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import FinanceDataContext from '../contexts/FinanceDataContext';
import FinancialOverview from '../components/dashboard/FinancialOverview';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingInsights from '../components/dashboard/SpendingInsights';
import GoalProgress from '../components/dashboard/GoalProgress';
import { financeApi } from '../api/finance';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { 
    accounts, 
    transactions, 
    budgets, 
    goals,
    insights,
    loading,
    error,
    fetchTransactions
  } = useContext(FinanceDataContext);
  
  const navigate = useNavigate();
  const [spendingTrends, setSpendingTrends] = useState(null);
  const [trendsLoading, setTrendsLoading] = useState(false);

  useEffect(() => {
    // Load spending trends for the dashboard
    const loadSpendingTrends = async () => {
      setTrendsLoading(true);
      try {
        const trends = await financeApi.getSpendingTrends('month');
        setSpendingTrends(trends);
      } catch (err) {
        console.error('Error loading spending trends:', err);
      } finally {
        setTrendsLoading(false);
      }
    };

    loadSpendingTrends();
  }, [transactions]);

  // Helper function to calculate total balance
  const calculateTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  // Helper to get current month budget usage
  const getCurrentBudgetUsage = () => {
    if (!budgets || budgets.length === 0) return null;
    
    const currentMonthBudget = budgets.find(budget => {
      const budgetDate = new Date(budget.month);
      const currentDate = new Date();
      return budgetDate.getMonth() === currentDate.getMonth() && 
             budgetDate.getFullYear() === currentDate.getFullYear();
    });

    if (!currentMonthBudget) return null;

    return {
      total: currentMonthBudget.amount,
      spent: currentMonthBudget.spent,
      remaining: currentMonthBudget.amount - currentMonthBudget.spent,
      categories: currentMonthBudget.categories
    };
  };

  // Handle connect bank click
  const handleConnectBank = () => {
    navigate('/connect-bank');
  };

  // Handle create budget click
  const handleCreateBudget = () => {
    navigate('/budget');
  };

  // Show empty state if no accounts
  if (accounts.length === 0 && !loading.accounts) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Welcome to FinanceAI</h1>
          <p className="text-lg text-gray-600">
            Connect your bank accounts to get started with personalized financial insights
          </p>
        </div>
        <button
          onClick={handleConnectBank}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white shadow-lg transition-all hover:bg-blue-700"
        >
          Connect Your Bank Account
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {currentUser?.firstName || 'User'}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center rounded-lg bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-1.008A6.972 6.972 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            Ask AI Assistant
          </button>
          <button
            onClick={handleConnectBank}
            className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Connect Account
          </button>
        </div>
      </div>

      {/* Financial Overview Section */}
      <FinancialOverview 
        accounts={accounts} 
        totalBalance={calculateTotalBalance()} 
        loading={loading.accounts} 
      />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Insights Card */}
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg">
          <div className="mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-xl font-bold">AI Financial Insights</h2>
          </div>
          
          {loading.insights ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            </div>
          ) : insights ? (
            <>
              <p className="mb-4 text-lg">{insights.summary}</p>
              <ul className="list-inside list-disc space-y-2">
                {insights.points.slice(0, 3).map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <button 
                onClick={() => navigate('/chat')}
                className="mt-4 rounded-lg bg-white bg-opacity-20 px-4 py-2 text-white hover:bg-opacity-30"
              >
                Ask AI for More Insights
              </button>
            </>
          ) : (
            <p className="text-lg">
              Connect your accounts and add transactions to get personalized financial insights
            </p>
          )}
        </div>

        {/* Budget Status */}
        {getCurrentBudgetUsage() ? (
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Monthly Budget</h2>
              <button 
                onClick={handleCreateBudget}
                className="text-blue-600 hover:text-blue-800"
              >
                Manage Budget
              </button>
            </div>
            
            {/* Budget Progress Bar */}
            <div className="mb-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  ${getCurrentBudgetUsage().spent.toFixed(2)} of ${getCurrentBudgetUsage().total.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {((getCurrentBudgetUsage().spent / getCurrentBudgetUsage().total) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div 
                  className={`h-full rounded-full ${
                    (getCurrentBudgetUsage().spent / getCurrentBudgetUsage().total) > 0.9 
                      ? 'bg-red-500' 
                      : (getCurrentBudgetUsage().spent / getCurrentBudgetUsage().total) > 0.75
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((getCurrentBudgetUsage().spent / getCurrentBudgetUsage().total) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            {/* Budget Categories */}
            <div className="mt-4">
              <h3 className="mb-2 font-medium text-gray-700">Top Categories</h3>
              <div className="space-y-2">
                {getCurrentBudgetUsage().categories.slice(0, 3).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="mr-2 h-3 w-3 rounded-full" 
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                      ></div>
                      <span className="text-sm text-gray-600">{category.name}</span>
                    </div>
                    <div className="text-sm font-medium">
                      <span className={category.spent > category.limit ? 'text-red-600' : 'text-gray-700'}>
                        ${category.spent.toFixed(2)}
                      </span>
                      <span className="text-gray-400"> / ${category.limit.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
            <p className="mb-4 text-center text-gray-600">
              You haven't set up a budget for this month yet
            </p>
            <button
              onClick={handleCreateBudget}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Create Budget
            </button>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <RecentTransactions 
        transactions={transactions.slice(0, 10)} 
        loading={loading.transactions} 
        onViewAll={() => navigate('/transactions')}
      />

      {/* Spending Insights and Goals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendingInsights 
          trends={spendingTrends} 
          loading={trendsLoading} 
        />
        
        <GoalProgress 
          goals={goals} 
          loading={loading.goals} 
          onAddGoal={() => navigate('/planning')} 
        />
      </div>
    </div>
  );
};

export default Dashboard;