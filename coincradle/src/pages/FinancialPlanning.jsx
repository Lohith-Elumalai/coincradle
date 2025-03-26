import React, { useState, useEffect, useContext } from 'react';
import FinanceDataContext from '../contexts/FinanceDataContext';
import { aiService } from '../services/ai.service';
import LineChart from "../components/ui/LineChart";
import ProgressBar from "../components/ui/ProgressBar";

const FinancialPlanning = () => {
  const { goals, accounts, investments, budgets, loading, createGoal } = useContext(FinanceDataContext);
  const [activeTab, setActiveTab] = useState('goals');
  const [projections, setProjections] = useState(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    category: 'savings', // savings, retirement, major_purchase, education, etc.
    priority: 'medium' // low, medium, high
  });
  const [loadingProjections, setLoadingProjections] = useState(false);

  // Fetch financial projections
  useEffect(() => {
    const fetchProjections = async () => {
      if (accounts.length > 0 || investments.length > 0) {
        setLoadingProjections(true);
        try {
          const data = await aiService.analyzeGoal({
            accounts,
            investments,
            budgets,
            goals,
            timeframe: 'long-term'
          });
          setProjections(data);
        } catch (err) {
          console.error('Error fetching financial projections:', err);
        } finally {
          setLoadingProjections(false);
        }
      }
    };

    fetchProjections();
  }, [accounts, investments, budgets, goals]);

  // Handle form changes for new goal
  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: name === 'targetAmount' || name === 'currentAmount' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle goal creation
  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await createGoal(newGoal);
      setShowGoalForm(false);
      setNewGoal({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        targetDate: '',
        category: 'savings',
        priority: 'medium'
      });
    } catch (err) {
      console.error('Error creating goal:', err);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days remaining until goal date
  const calculateDaysRemaining = (targetDate) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate goal progress
  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Financial Planning</h1>
        <button
          onClick={() => setShowGoalForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Goal
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('goals')}
            className={`mr-8 whitespace-nowrap border-b-2 py-4 text-sm font-medium ${
              activeTab === 'goals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Financial Goals
          </button>
          <button
            onClick={() => setActiveTab('retirement')}
            className={`mr-8 whitespace-nowrap border-b-2 py-4 text-sm font-medium ${
              activeTab === 'retirement'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Retirement Planning
          </button>
          <button
            onClick={() => setActiveTab('projections')}
            className={`mr-8 whitespace-nowrap border-b-2 py-4 text-sm font-medium ${
              activeTab === 'projections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Financial Projections
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'goals' ? (
        <div>
          {loading.goals ? (
            <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-md">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="ml-2 text-gray-600">Loading goals...</p>
            </div>
          ) : goals && goals.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">{goal.name}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        goal.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : goal.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500">Progress</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      <ProgressBar 
                        value={calculateProgress(goal.currentAmount, goal.targetAmount)} 
                        max={100} 
                        height={8} 
                        color="blue" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Target Date</p>
                        <p className="font-medium text-gray-800">{formatDate(goal.targetDate)}</p>
                        <p className="text-xs text-gray-500">
                          {calculateDaysRemaining(goal.targetDate)} days remaining
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium text-gray-800">
                          {goal.category.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Monthly Contribution Needed</span>
                        <span className="font-medium text-gray-800">{formatCurrency(goal.monthlyContribution || 0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h2 className="mt-4 text-xl font-medium text-gray-800">No Financial Goals Yet</h2>
              <p className="mt-2 text-center text-gray-600">
                Set financial goals to track your progress and get personalized recommendations.
              </p>
              <button
                onClick={() => setShowGoalForm(true)}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Create Your First Goal
              </button>
            </div>
          )}
        </div>
      ) : activeTab === 'retirement' ? (
        <div>
          {/* Retirement Planning Section */}
          {projections && projections.retirementProjection ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-medium text-gray-800">Retirement Projection</h2>
                {loadingProjections ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 h-64">
                      <LineChart 
                        data={projections.retirementProjection.projectionData} 
                        xKey="year" 
                        yKey="balance" 
                        height={256}
                        color="#10B981"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-green-50 p-4">
                        <p className="text-sm font-medium text-green-800">Est. Retirement Value</p>
                        <p className="mt-1 text-xl font-bold text-green-900">
                          {formatCurrency(projections.retirementProjection.estimatedValue)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-4">
                        <p className="text-sm font-medium text-blue-800">Monthly Income</p>
                        <p className="mt-1 text-xl font-bold text-blue-900">
                          {formatCurrency(projections.retirementProjection.estimatedMonthlyIncome)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-purple-50 p-4">
                        <p className="text-sm font-medium text-purple-800">Retirement Age</p>
                        <p className="mt-1 text-xl font-bold text-purple-900">
                          {projections.retirementProjection.estimatedRetirementAge}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-medium text-gray-800">Retirement Planning</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Retirement Savings</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatCurrency(projections.retirementProjection.currentSavings || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Monthly Contribution</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatCurrency(projections.retirementProjection.monthlyContribution || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recommended Monthly Contribution</p>
                    <p className="text-lg font-medium text-green-600">
                      {formatCurrency(projections.retirementProjection.recommendedContribution || 0)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                      {projections.retirementProjection.advice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="mt-4 text-xl font-medium text-gray-800">Retirement Planner</h2>
              <p className="mt-2 text-center text-gray-600">
                Connect your retirement accounts or add them manually to see your retirement projections.
              </p>
              <button
                onClick={() => {/* Add implementation */}}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Add Retirement Account
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Financial Projections Section */}
          {projections ? (
            <div className="space-y-6">
              {/* Net Worth Projection */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-medium text-gray-800">Net Worth Projection</h2>
                {loadingProjections ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 h-64">
                      <LineChart 
                        data={projections.netWorthProjection.projectionData} 
                        xKey="year" 
                        yKey="netWorth" 
                        height={256}
                        color="#3B82F6"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-lg bg-blue-50 p-4">
                        <p className="text-sm font-medium text-blue-800">Current Net Worth</p>
                        <p className="mt-1 text-xl font-bold text-blue-900">
                          {formatCurrency(projections.netWorthProjection.currentNetWorth)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-4">
                        <p className="text-sm font-medium text-blue-800">Projected in 10 Years</p>
                        <p className="mt-1 text-xl font-bold text-blue-900">
                          {formatCurrency(projections.netWorthProjection.tenYearProjection)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-green-50 p-4">
                      <p className="text-sm text-green-800">
                        {projections.netWorthProjection.advice}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* Financial Milestones */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-medium text-gray-800">Financial Milestones</h2>
                <div className="space-y-6">
                  {projections.milestones.map((milestone, index) => (
                    <div key={index} className="relative pl-8 pb-8">
                      {/* Timeline connector */}
                      {index < projections.milestones.length - 1 && (
                        <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-blue-200"></div>
                      )}
                      {/* Milestone dot */}
                      <div className="absolute top-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{milestone.title}</h3>
                        <p className="text-sm text-gray-500">
                          {milestone.timeframe} - {formatCurrency(milestone.amount)}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* AI Financial Insights */}
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-md">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h2 className="text-lg font-medium">AI Financial Insights</h2>
                </div>
                
                <p className="mt-4">{projections.aiInsights.summary}</p>
                
                <ul className="mt-4 space-y-2">
                  {projections.aiInsights.points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h2 className="mt-4 text-xl font-medium text-gray-800">Financial Projections</h2>
              <p className="mt-2 text-center text-gray-600">
                Connect your financial accounts and set goals to see personalized financial projections.
              </p>
            </div>
          )}
        </div>
      )};
     
      // Continuing src/pages/FinancialPlanning.jsx - Goal Creation Modal
      {/* Goal Creation Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Create New Financial Goal</h3>
              <button
                onClick={() => setShowGoalForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateGoal}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Goal Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={newGoal.name}
                  onChange={handleGoalChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. Buy a House, Emergency Fund, etc."
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={newGoal.category}
                  onChange={handleGoalChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="savings">Savings</option>
                  <option value="retirement">Retirement</option>
                  <option value="major_purchase">Major Purchase</option>
                  <option value="education">Education</option>
                  <option value="travel">Travel</option>
                  <option value="emergency_fund">Emergency Fund</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
                    Target Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="targetAmount"
                      name="targetAmount"
                      min="0"
                      step="0.01"
                      required
                      value={newGoal.targetAmount}
                      onChange={handleGoalChange}
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700">
                    Current Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="currentAmount"
                      name="currentAmount"
                      min="0"
                      step="0.01"
                      required
                      value={newGoal.currentAmount}
                      onChange={handleGoalChange}
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                  Target Date
                </label>
                <input
                  type="date"
                  id="targetDate"
                  name="targetDate"
                  required
                  value={newGoal.targetDate}
                  onChange={handleGoalChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  required
                  value={newGoal.priority}
                  onChange={handleGoalChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPlanning;