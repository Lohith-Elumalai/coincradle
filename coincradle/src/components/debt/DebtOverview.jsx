// src/components/debt/DebtOverview.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import { Alert } from '../common/Alert';
import { PieChart } from '../ui/PieChart';
import { formatCurrency } from '../../utils/formatters';
import useFinanceData from '../../hooks/useFinanceData';
import useDebt from '../../hooks/useDebt';

const DebtOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debtSummary, setDebtSummary] = useState(null);
  const { getDebtAccounts, getDebtSummary } = useDebt();
  const { refreshFinancialData } = useFinanceData();

  useEffect(() => {
    fetchDebtData();
  }, []);

  const fetchDebtData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const summary = await getDebtSummary();
      setDebtSummary(summary);
    } catch (err) {
      setError('Failed to load debt information. Please try again.');
      console.error('Error fetching debt data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await refreshFinancialData();
      await fetchDebtData();
    } catch (err) {
      setError('Failed to refresh data.');
      console.error('Error refreshing debt data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title="Error Loading Debt Data">
        {error}
        <Button variant="secondary" size="sm" onClick={fetchDebtData} className="mt-2">
          Try Again
        </Button>
      </Alert>
    );
  }

  if (!debtSummary || !debtSummary.accounts || debtSummary.accounts.length === 0) {
    return (
      <Alert type="info" title="No Debt Accounts Found">
        You don't have any debt accounts set up. Add a debt account to track your balances and payments.
        <Button variant="primary" size="sm" className="mt-2">
          Add Debt Account
        </Button>
      </Alert>
    );
  }

  // Calculate debt distribution data for pie chart
  const chartData = debtSummary.accounts.map(account => ({
    name: account.name,
    value: account.balance,
    color: getColorByDebtType(account.type)
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Debt Overview</h2>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white">
          <div className="p-4">
            <h3 className="text-sm text-gray-500 uppercase font-medium">Total Debt</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(debtSummary.totalDebt)}</p>
          </div>
        </Card>
        
        <Card className="bg-white">
          <div className="p-4">
            <h3 className="text-sm text-gray-500 uppercase font-medium">Monthly Payments</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(debtSummary.monthlyPayments)}</p>
          </div>
        </Card>
        
        <Card className="bg-white">
          <div className="p-4">
            <h3 className="text-sm text-gray-500 uppercase font-medium">Avg. Interest Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{debtSummary.averageInterestRate}%</p>
          </div>
        </Card>
      </div>

      {/* Debt Distribution */}
      <Card className="bg-white">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Debt Distribution</h3>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 h-64">
              <PieChart data={chartData} />
            </div>
            <div className="w-full md:w-1/2 p-4">
              <div className="space-y-4">
                {debtSummary.accounts.map(account => (
                  <div key={account.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: getColorByDebtType(account.type) }}
                      />
                      <span>{account.name}</span>
                      <Badge className="ml-2" color={getStatusColor(account.status)}>
                        {account.status}
                      </Badge>
                    </div>
                    <span className="font-semibold">{formatCurrency(account.balance)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Payoff Progress */}
      <Card className="bg-white">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Payoff Progress</h3>
          <div className="space-y-4">
            {debtSummary.accounts.map(account => (
              <div key={account.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{account.name}</span>
                  <span>
                    {formatCurrency(account.balance)} of {formatCurrency(account.originalBalance)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.max(0, Math.min(100, (1 - account.balance / account.originalBalance) * 100))}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Est. payoff: {account.estimatedPayoffDate}</span>
                  <span>{account.interestRate}% APR</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Debt Metrics */}
      <Card className="bg-white">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Debt Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-gray-500">Debt-to-Income Ratio</h4>
              <div className="flex items-end space-x-2">
                <span className="text-xl font-bold">{debtSummary.debtToIncomeRatio}%</span>
                <span className={`text-sm ${getDTIRatioColor(debtSummary.debtToIncomeRatio)}`}>
                  {getDTIRatioStatus(debtSummary.debtToIncomeRatio)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Percentage of your monthly income going to debt payments
              </p>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-500">Interest Paid This Year</h4>
              <div className="flex items-end space-x-2">
                <span className="text-xl font-bold">{formatCurrency(debtSummary.interestPaidYTD)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total interest paid year-to-date across all debt accounts
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Helper functions
const getColorByDebtType = (type) => {
  const colors = {
    mortgage: '#4C51BF', // Indigo
    studentLoan: '#2B6CB0', // Blue
    carLoan: '#2C7A7B', // Teal
    creditCard: '#C05621', // Orange
    personalLoan: '#6B46C1', // Purple
    medical: '#DD6B20', // Orange
    other: '#718096', // Gray
  };
  
  return colors[type] || colors.other;
};

const getStatusColor = (status) => {
  const colors = {
    current: 'green',
    attention: 'yellow',
    late: 'red',
    deferred: 'blue'
  };
  
  return colors[status] || 'gray';
};

const getDTIRatioColor = (ratio) => {
  if (ratio < 28) return 'text-green-600';
  if (ratio < 36) return 'text-yellow-600';
  return 'text-red-600';
};

const getDTIRatioStatus = (ratio) => {
  if (ratio < 28) return 'Good';
  if (ratio < 36) return 'Caution';
  return 'High';
};

export default DebtOverview;