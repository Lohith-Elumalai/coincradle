// src/components/debt/PaymentPlan.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Alert } from '../common/Alert';
import { Spinner } from '../common/Spinner';
import { LineChart } from '../ui/LineChart';
import { DataTable } from '../ui/DataTable';
import { ProgressBar } from '../ui/ProgressBar';
import { formatCurrency } from '../../utils/formatters';
import useDebt from '../../hooks/useDebt';
import useAI from '../../hooks/useAI';

const PaymentPlan = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [strategy, setStrategy] = useState('snowball');
  const [customAmount, setCustomAmount] = useState('');
  const [debtAccounts, setDebtAccounts] = useState([]);
  const [paymentPlan, setPaymentPlan] = useState(null);
  const [showStrategyInfo, setShowStrategyInfo] = useState(false);
  const [isGeneratingAIPlan, setIsGeneratingAIPlan] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  
  const { getDebtAccounts, generatePaymentPlan, applyExtraPayment } = useDebt();
  const { getDebtPaymentPlan } = useAI();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accounts = await getDebtAccounts();
      setDebtAccounts(accounts);
      
      if (accounts.length > 0) {
        generatePlan(strategy);
      }
    } catch (err) {
      setError('Failed to load debt accounts. Please try again.');
      console.error('Error fetching debt accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePlan = async (selectedStrategy) => {
    setIsLoading(true);
    try {
      const plan = await generatePaymentPlan({
        strategy: selectedStrategy,
        extraPayment: parseFloat(customAmount) || 0
      });
      setPaymentPlan(plan);
      setStrategy(selectedStrategy);
    } catch (err) {
      setError('Failed to generate payment plan.');
      console.error('Error generating payment plan:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStrategyChange = (e) => {
    const newStrategy = e.target.value;
    setStrategy(newStrategy);
    generatePlan(newStrategy);
  };
  
  const handleCustomAmountChange = (e) => {
    const amount = e.target.value;
    // Allow only numbers and decimal point
    if (amount === '' || /^\d+(\.\d{0,2})?$/.test(amount)) {
      setCustomAmount(amount);
    }
  };
  
  const handleApplyCustomAmount = () => {
    generatePlan(strategy);
  };
  
  const handleGenerateAIPlan = async () => {
    setIsGeneratingAIPlan(true);
    try {
      const aiPlan = await getDebtPaymentPlan();
      setPaymentPlan(aiPlan);
      // AI might recommend a specific strategy
      if (aiPlan.recommendedStrategy) {
        setStrategy(aiPlan.recommendedStrategy);
      }
    } catch (err) {
      setError('Failed to generate AI payment plan. Try a standard strategy instead.');
      console.error('Error generating AI payment plan:', err);
    } finally {
      setIsGeneratingAIPlan(false);
    }
  };
  
  const handleAdjustDebt = (debtId) => {
    setSelectedDebtId(debtId);
    setShowAdjustModal(true);
  };
  
  const handleApplyAdjustment = async (adjustmentData) => {
    try {
      await applyExtraPayment(selectedDebtId, adjustmentData);
      setShowAdjustModal(false);
      fetchData(); // Refresh data after adjustment
    } catch (err) {
      setError('Failed to apply adjustment.');
      console.error('Error applying debt adjustment:', err);
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
      <Alert type="error" title="Error Loading Payment Plan">
        {error}
        <Button variant="secondary" size="sm" onClick={fetchData} className="mt-2">
          Try Again
        </Button>
      </Alert>
    );
  }

  if (!debtAccounts || debtAccounts.length === 0) {
    return (
      <Alert type="info" title="No Debt Accounts Found">
        You don't have any debt accounts set up. Add a debt account to create a payment plan.
        <Button variant="primary" size="sm" className="mt-2">
          Add Debt Account
        </Button>
      </Alert>
    );
  }

  // Table columns for payment schedule
  const paymentScheduleColumns = [
    { header: 'Debt', accessor: 'name' },
    { 
      header: 'Initial Balance', 
      accessor: 'initialBalance',
      cell: (row) => formatCurrency(row.initialBalance) 
    },
    { 
      header: 'Interest Rate', 
      accessor: 'interestRate',
      cell: (row) => `${row.interestRate}%` 
    },
    { 
      header: 'Monthly Payment', 
      accessor: 'monthlyPayment',
      cell: (row) => formatCurrency(row.monthlyPayment) 
    },
    { 
      header: 'Payoff Date', 
      accessor: 'payoffDate' 
    },
    { 
      header: 'Total Interest', 
      accessor: 'totalInterest',
      cell: (row) => formatCurrency(row.totalInterest) 
    },
    { 
      header: 'Actions', 
      accessor: 'id',
      cell: (row) => (
        <Button 
          variant="text" 
          size="sm" 
          onClick={() => handleAdjustDebt(row.id)}
        >
          Adjust
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold">Debt Payment Plan</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setShowStrategyInfo(true)}
          >
            About Strategies
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleGenerateAIPlan}
            disabled={isGeneratingAIPlan}
          >
            {isGeneratingAIPlan ? <Spinner size="sm" /> : 'Generate AI Plan'}
          </Button>
        </div>
      </div>

      {/* Strategy Selection Card */}
      <Card className="bg-white">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Payment Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Strategy
              </label>
              <Select 
                value={strategy} 
                onChange={handleStrategyChange}
                className="w-full"
              >
                <option value="snowball">Debt Snowball (Smallest Balance First)</option>
                <option value="avalanche">Debt Avalanche (Highest Interest First)</option>
                <option value="highestBalance">Highest Balance First</option>
                <option value="custom">Custom Priority</option>
                {paymentPlan?.isAIRecommended && (
                  <option value="ai">AI Recommended Plan</option>
                )}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Monthly Payment
              </label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="0.00"
                  className="w-full"
                />
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleApplyCustomAmount}
                >
                  Apply
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col justify-end">
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Monthly Payment: </span>
                  {formatCurrency(paymentPlan?.totalMonthlyPayment || 0)}
                </div>
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Debt-Free By: </span>
                  {paymentPlan?.debtFreeDate || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Summary Card */}
      {paymentPlan && (
        <Card className="bg-white">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-4">
                <h4 className="text-md font-medium mb-3">Interest Savings</h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(paymentPlan.interestSavings)}
                  </span>
                  <span className="text-sm text-gray-500">
                    vs. minimum payments
                  </span>
                </div>
                
                <h4 className="text-md font-medium mt-6 mb-3">Time Savings</h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-green-600">
                    {paymentPlan.timeSavings} months
                  </span>
                  <span className="text-sm text-gray-500">
                    ({Math.floor(paymentPlan.timeSavings / 12)} years, {paymentPlan.timeSavings % 12} months)
                  </span>
                </div>
                
                {paymentPlan.isAIRecommended && (
                  <div className="mt-6 bg-purple-50 p-3 rounded-md">
                    <p className="text-sm text-purple-800">
                      <span className="font-bold">AI Recommendation: </span>
                      {paymentPlan.aiRecommendation}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 h-64">
                <LineChart 
                  data={paymentPlan.projectionData} 
                  xKey="date" 
                  yKey="balance"
                  comparisonKey="minimumPaymentBalance"
                  xLabel="Date"
                  yLabel="Balance"
                  colors={['#4C51BF', '#A0AEC0']}
                />
                <div className="flex justify-center text-xs text-gray-500 mt-2">
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 bg-indigo-800 rounded-full mr-1"></div>
                    <span>Current Plan</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
                    <span>Minimum Payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Payoff Order Card */}
      {paymentPlan && (
        <Card className="bg-white">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Payoff Order</h3>
            <div className="space-y-6">
              {paymentPlan.payoffOrder.map((debt, index) => (
                <div key={debt.id} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-bold text-lg">{index + 1}. {debt.name}</span>
                      <span className="ml-2 text-gray-500 text-sm">
                        {formatCurrency(debt.initialBalance)} at {debt.interestRate}%
                      </span>
                    </div>
                    <Badge
                      color={index === 0 ? 'green' : 'gray'}
                    >
                      {index === 0 ? 'Current Focus' : `Priority #${index + 1}`}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <ProgressBar 
                      progress={debt.progressPercentage} 
                      color={getProgressColor(debt.progressPercentage)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Remaining</span>
                      <span className="font-medium">{formatCurrency(debt.remainingBalance)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Monthly Payment</span>
                      <span className="font-medium">{formatCurrency(debt.monthlyPayment)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Payoff Date</span>
                      <span className="font-medium">{debt.payoffDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Interest Remaining</span>
                      <span className="font-medium">{formatCurrency(debt.remainingInterest)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Payment Schedule Table */}
      {paymentPlan && (
        <Card className="bg-white">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Complete Payment Schedule</h3>
            <DataTable 
              columns={paymentScheduleColumns} 
              data={paymentPlan.paymentSchedule}
              pagination
            />
          </div>
        </Card>
      )}

      {/* Strategy Info Modal */}
      <Modal
        isOpen={showStrategyInfo}
        onClose={() => setShowStrategyInfo(false)}
        title="Debt Payoff Strategies"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-bold">Debt Snowball</h4>
            <p className="text-sm text-gray-600">
              Focuses on paying off debts from smallest to largest balance, regardless of interest rate. 
              This method helps build momentum by achieving small wins quickly.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold">Debt Avalanche</h4>
            <p className="text-sm text-gray-600">
              Focuses on paying off debts with the highest interest rates first. 
              This approach minimizes the total interest paid over time.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold">Highest Balance First</h4>
            <p className="text-sm text-gray-600">
              Focuses on paying off the largest debts first. This can be useful when you want to 
              reduce your total debt burden quickly.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold">Custom Priority</h4>
            <p className="text-sm text-gray-600">
              Allows you to set your own payoff order based on personal priorities.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold">AI Recommended Plan</h4>
            <p className="text-sm text-gray-600">
              Uses an AI algorithm to analyze your financial situation and recommend a
              personalized debt payoff strategy that considers various factors.
            </p>
          </div>
          
          <Alert type="info" title="Quick Tip">
            Adding even a small amount extra to your minimum payments can significantly
            reduce your payoff time and save money on interest.
          </Alert>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShowStrategyInfo(false)}>Close</Button>
        </div>
      </Modal>

      {/* Adjust Debt Modal */}
      {selectedDebtId && (
        <AdjustDebtModal
          isOpen={showAdjustModal}
          onClose={() => setShowAdjustModal(false)}
          debtAccount={debtAccounts.find(account => account.id === selectedDebtId)}
          onApply={handleApplyAdjustment}
        />
      )}
    </div>
  );
};

// Debt adjustment modal component
const AdjustDebtModal = ({ isOpen, onClose, debtAccount, onApply }) => {
  const [adjustmentType, setAdjustmentType] = useState('extraPayment');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('oneTime');
  
  const handleSubmit = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      return;
    }
    
    onApply({
      type: adjustmentType,
      amount: parseFloat(amount),
      frequency,
      debtId: debtAccount.id
    });
  };
  
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adjust ${debtAccount?.name || 'Debt'}`}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adjustment Type
          </label>
          <Select 
            value={adjustmentType} 
            onChange={(e) => setAdjustmentType(e.target.value)}
            className="w-full"
          >
            <option value="extraPayment">Extra Payment</option>
            <option value="refinance">Simulate Refinance</option>
            <option value="consolidation">Simulate Consolidation</option>
            <option value="payoff">Full Payoff</option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder={adjustmentType === 'refinance' ? 'New Interest Rate %' : '0.00'}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            {adjustmentType === 'refinance' 
              ? 'Enter the new interest rate percentage' 
              : 'Enter the payment amount'}
          </p>
        </div>
        
        {adjustmentType === 'extraPayment' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <Select 
              value={frequency} 
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full"
            >
              <option value="oneTime">One Time</option>
              <option value="monthly">Monthly</option>
              <option value="biweekly">Bi-Weekly</option>
            </Select>
          </div>
        )}
        
        <Alert type="info" title="Impact Analysis">
          {adjustmentType === 'extraPayment' && 'Making extra payments can significantly reduce your total interest paid and payoff time.'}
          {adjustmentType === 'refinance' && 'Refinancing can lower your interest rate and monthly payments, but may extend the loan term.'}
          {adjustmentType === 'consolidation' && 'Debt consolidation combines multiple debts into one, potentially with a lower interest rate.'}
          {adjustmentType === 'payoff' && 'Paying off a debt completely will remove it from your payment plan.'}
        </Alert>
      </div>
      
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Apply</Button>
      </div>
    </Modal>
  );
};

// Helper function to determine progress bar color
const getProgressColor = (percentage) => {
  if (percentage < 25) return 'red';
  if (percentage < 50) return 'orange';
  if (percentage < 75) return 'blue';
  return 'green';
};

// Helper component for badge
const Badge = ({ children, color = 'gray', className = '' }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

export default PaymentPlan;