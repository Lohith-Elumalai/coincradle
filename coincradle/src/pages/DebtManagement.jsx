import React, { useState, useContext, useEffect } from 'react';
import FinanceDataContext from '../contexts/FinanceDataContext';
import { aiService } from '../services/ai.service';
import { LineChart, ProgressBar } from '../components/ui';

const DebtManagement = () => {
  const { debts, loading } = useContext(FinanceDataContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [payoffPlan, setPayoffPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('avalanche'); // 'avalanche' or 'snowball'
  
  // Fetch AI debt payoff recommendations when debts change or strategy changes
  useEffect(() => {
    const fetchPayoffPlan = async () => {
      if (debts && debts.length > 0) {
        setLoadingPlan(true);
        try {
          const plan = await aiService.createDebtPaymentPlan({
            debts,
            strategy: selectedStrategy,
            monthlyPayment: calculateMinimumPayments() + 200 // Extra payment
          });
          setPayoffPlan(plan);
        } catch (err) {
          console.error('Error fetching debt payoff plan:', err);
        } finally {
          setLoadingPlan(false);
        }
      }
    };
    
    fetchPayoffPlan();
  }, [debts, selectedStrategy]);
  
  // Calculate total debt amount
  const calculateTotalDebt = () => {
    if (!debts || debts.length === 0) return 0;
    return debts.reduce((total, debt) => total + debt.currentBalance, 0);
  };
  
  // Calculate total minimum payments
  const calculateMinimumPayments = () => {
    if (!debts || debts.length === 0) return 0;
    return debts.reduce((total, debt) => total + debt.minimumPayment, 0);
  };
  
  // Calculate average interest rate
  const calculateAverageInterestRate = () => {
    if (!debts || debts.length === 0) return 0;
    
    const totalBalance = calculateTotalDebt();
    const weightedSum = debts.reduce(
      (sum, debt) => sum + (debt.interestRate * debt.currentBalance),
      0
    );
    
    return weightedSum / totalBalance;
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
      month: 'long'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Debt Management</h1>
        <button
          onClick={() => {/* Add implementation */}}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Debt
        </button>
      </div>
      
      {loading.debts ? (
        <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-md">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-2 text-gray-600">Loading debt data...</p>
        </div>
      ) : debts && debts.length > 0 ? (
        <>
          {/* Debt Overview */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <p className="text-sm font-medium text-gray-500">Total Debt</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(calculateTotalDebt())}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <p className="text-sm font-medium text-gray-500">Monthly Minimum</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(calculateMinimumPayments())}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <p className="text-sm font-medium text-gray-500">Avg. Interest Rate</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{calculateAverageInterestRate().toFixed(2)}%</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`mr-8 whitespace-nowrap border-b-2 py-4 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('payoff-plan')}
                className={`mr-8 whitespace-nowrap border-b-2 py-4 text-sm font-medium ${
                  activeTab === 'payoff-plan'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Payoff Plan
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'overview' ? (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-medium text-gray-800">Your Debts</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Debt Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Balance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Interest Rate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Minimum Payment
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Payoff Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {debts.map((debt) => {
                      // Calculate payoff progress percentage
                      const progress = ((debt.originalBalance - debt.currentBalance) / debt.originalBalance) * 100;
                      
                      return (
                        <tr key={debt.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{debt.name}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{debt.type}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{formatCurrency(debt.currentBalance)}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{debt.interestRate.toFixed(2)}%</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{formatCurrency(debt.minimumPayment)}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="w-32">
                              <ProgressBar 
                                value={progress} 
                                max={100} 
                                height={8} 
                                color={debt.interestRate > 10 ? 'red' : debt.interestRate > 5 ? 'yellow' : 'green'} 
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Debt Payoff Plan</h2>
                <div className="flex rounded-lg border border-gray-300">
                  <button
                    onClick={() => setSelectedStrategy('avalanche')}
                    className={`px-4 py-2 text-sm ${
                      selectedStrategy === 'avalanche'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Avalanche Method
                  </button>
                  <button
                    onClick={() => setSelectedStrategy('snowball')}
                    className={`px-4 py-2 text-sm ${
                      selectedStrategy === 'snowball'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Snowball Method
                  </button>
                </div>
              </div>
              
              {loadingPlan ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  <p className="ml-2 text-gray-600">Calculating payoff plan...</p>
                </div>
              ) : payoffPlan ? (
                <div>
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-sm font-medium text-blue-800">Debt Free By</p>
                      <p className="mt-1 text-xl font-bold text-blue-900">
                        {formatDate(payoffPlan.debtFreeDate)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-sm font-medium text-blue-800">Total Interest Saved</p>
                      <p className="mt-1 text-xl font-bold text-blue-900">
                        {formatCurrency(payoffPlan.interestSaved)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-sm font-medium text-blue-800">Time Saved</p>
                      <p className="mt-1 text-xl font-bold text-blue-900">
                        {payoffPlan.monthsSaved} months
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="mb-2 font-medium text-gray-800">Payment Strategy</h3>
                    <p className="text-gray-600">
                      {selectedStrategy === 'avalanche' 
                        ? 'The Avalanche Method focuses on paying off debts with the highest interest rates first, which minimizes the total interest you pay.'
                        : 'The Snowball Method focuses on paying off the smallest debts first, which helps build momentum and motivation as you eliminate each debt.'}
                    </p>
                    <div className="mt-4 rounded-lg bg-green-50 p-4">
                      <p className="text-sm text-green-800">
                        {payoffPlan.recommendation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="mb-2 font-medium text-gray-800">Balance Projection</h3>
                    <div className="h-64">
                      <LineChart 
                        data={payoffPlan.projectionData} 
                        xKey="date" 
                        yKey="balance" 
                        height={256}
                        color="#3B82F6"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="mb-4 font-medium text-gray-800">Debt Payoff Schedule</h3>
                    <div className="space-y-8">
                      {payoffPlan.debts.map((debt, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-medium text-gray-800">{debt.name}</h4>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Current Balance: {formatCurrency(debt.currentBalance)}</p>
                              <p className="text-sm text-gray-500">Interest Rate: {debt.interestRate.toFixed(2)}%</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Payoff Progress</span>
                              <span className="text-sm font-medium">
                                {formatCurrency(debt.originalBalance - debt.currentBalance)} of {formatCurrency(debt.originalBalance)}
                              </span>
                            </div>
                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                              <div 
                                className="h-full rounded-full bg-blue-500" 
                                style={{ 
                                  width: `${((debt.originalBalance - debt.currentBalance) / debt.originalBalance) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Payoff Date</p>
                              <p className="text-gray-800">{formatDate(debt.payoffDate)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Monthly Payment</p>
                              <p className="text-gray-800">{formatCurrency(debt.monthlyPayment)}</p>
                              <p className="text-xs text-gray-500">
                                (Minimum: {formatCurrency(debt.minimumPayment)})
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500">No payoff plan available</p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-800">No Debts Found</h2>
          <p className="mt-2 text-center text-gray-600">
            You don't have any debts added to your account yet. Add your first debt to start managing it.
          </p>
          <button
            onClick={() => {/* Add implementation */}}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add Debt
          </button>
        </div>
      )}
    </div>
  );
};

export default DebtManagement;