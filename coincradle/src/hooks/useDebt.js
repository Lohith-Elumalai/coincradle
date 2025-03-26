// src/hooks/useDebt.js
import { useState, useEffect, useContext, useCallback } from 'react';
import FinanceDataContext from '../contexts/FinanceDataContext';
import { aiService } from '../services/ai.service';

/**
 * Hook for debt management functionality
 * Provides debt data, calculations, and optimization strategies
 */
const useDebt = () => {
  const { debts, loading, addDebt, updateDebt, fetchDebts } = useContext(FinanceDataContext);
  
  const [payoffPlan, setPayoffPlan] = useState(null);
  const [payoffStrategy, setPayoffStrategy] = useState('avalanche'); // 'avalanche' or 'snowball'
  const [additionalPayment, setAdditionalPayment] = useState(0);
  const [payoffTimeline, setPayoffTimeline] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState(null);
  
  // Calculate total debt
  const calculateTotalDebt = useCallback(() => {
    if (!debts || debts.length === 0) return 0;
    return debts.reduce((total, debt) => total + debt.currentBalance, 0);
  }, [debts]);

  // Calculate total monthly minimum payments
  const calculateTotalMinimumPayment = useCallback(() => {
    if (!debts || debts.length === 0) return 0;
    return debts.reduce((total, debt) => total + debt.minimumPayment, 0);
  }, [debts]);

  // Calculate weighted average interest rate
  const calculateAverageInterestRate = useCallback(() => {
    if (!debts || debts.length === 0) return 0;
    
    const totalDebt = calculateTotalDebt();
    if (totalDebt === 0) return 0;
    
    const weightedSum = debts.reduce(
      (sum, debt) => sum + (debt.interestRate * debt.currentBalance),
      0
    );
    
    return (weightedSum / totalDebt);
  }, [debts, calculateTotalDebt]);

  // Generate payoff plan when debts, strategy, or additional payment changes
  useEffect(() => {
    const generatePayoffPlan = async () => {
      if (!debts || debts.length === 0) return;
      
      setLoadingPlan(true);
      setError(null);
      
      try {
        const totalMinimumPayment = calculateTotalMinimumPayment();
        const monthlyPayment = totalMinimumPayment + additionalPayment;
        
        const plan = await aiService.createDebtPaymentPlan({
          debts,
          strategy: payoffStrategy,
          additionalPayment,
          monthlyPayment
        });
        
        setPayoffPlan(plan);
        setPayoffTimeline(plan.timeline || []);
      } catch (err) {
        console.error('Error generating debt payoff plan:', err);
        setError('Failed to generate debt payoff plan. Please try again.');
      } finally {
        setLoadingPlan(false);
      }
    };
    
    generatePayoffPlan();
  }, [debts, payoffStrategy, additionalPayment, calculateTotalMinimumPayment]);

  // Add a new debt
  const handleAddDebt = async (debtData) => {
    try {
      await addDebt(debtData);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to add debt');
      return false;
    }
  };

  // Update an existing debt
  const handleUpdateDebt = async (debtId, debtData) => {
    try {
      await updateDebt(debtId, debtData);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update debt');
      return false;
    }
  };

  // Make a payment on a debt
  const makePayment = async (debtId, paymentAmount) => {
    try {
      const debtToUpdate = debts.find(debt => debt.id === debtId);
      if (!debtToUpdate) {
        throw new Error('Debt not found');
      }
      
      const newBalance = Math.max(0, debtToUpdate.currentBalance - paymentAmount);
      
      await updateDebt(debtId, {
        ...debtToUpdate,
        currentBalance: newBalance,
        lastPaymentDate: new Date().toISOString(),
        lastPaymentAmount: paymentAmount
      });
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to process payment');
      return false;
    }
  };

  // Calculate months to payoff for a specific debt
  const calculateMonthsToPayoff = (debt) => {
    if (!debt || debt.currentBalance <= 0 || debt.minimumPayment <= 0) return 0;
    
    const monthlyInterestRate = debt.interestRate / 100 / 12;
    let balance = debt.currentBalance;
    let months = 0;
    const payment = Math.max(debt.minimumPayment, 1); // Minimum payment of $1
    
    while (balance > 0 && months < 1200) { // Cap at 100 years to prevent infinite loops
      const interest = balance * monthlyInterestRate;
      balance = balance + interest - payment;
      months++;
    }
    
    return months;
  };

  // Compare strategies (avalanche vs snowball)
  const compareStrategies = useCallback(async () => {
    setLoadingPlan(true);
    setError(null);
    
    try {
      const totalMinimumPayment = calculateTotalMinimumPayment();
      const monthlyPayment = totalMinimumPayment + additionalPayment;
      
      // Get plans for both strategies
      const avalanchePlan = await aiService.createDebtPaymentPlan({
        debts,
        strategy: 'avalanche',
        additionalPayment,
        monthlyPayment
      });
      
      const snowballPlan = await aiService.createDebtPaymentPlan({
        debts,
        strategy: 'snowball',
        additionalPayment,
        monthlyPayment
      });
      
      return {
        avalanche: {
          months: avalanchePlan.totalMonths,
          totalInterest: avalanchePlan.totalInterest,
          totalPaid: avalanchePlan.totalPaid
        },
        snowball: {
          months: snowballPlan.totalMonths,
          totalInterest: snowballPlan.totalInterest,
          totalPaid: snowballPlan.totalPaid
        },
        difference: {
          months: snowballPlan.totalMonths - avalanchePlan.totalMonths,
          totalInterest: snowballPlan.totalInterest - avalanchePlan.totalInterest,
          totalPaid: snowballPlan.totalPaid - avalanchePlan.totalPaid
        },
        recommendation: avalanchePlan.totalInterest <= snowballPlan.totalInterest 
          ? 'avalanche' 
          : 'snowball'
      };
    } catch (err) {
      console.error('Error comparing debt strategies:', err);
      setError('Failed to compare debt strategies. Please try again.');
      return null;
    } finally {
      setLoadingPlan(false);
    }
  }, [debts, additionalPayment, calculateTotalMinimumPayment]);

  return {
    debts,
    loading: loading.debts,
    loadingPlan,
    error,
    payoffPlan,
    payoffTimeline,
    payoffStrategy,
    additionalPayment,
    totalDebt: calculateTotalDebt(),
    totalMinimumPayment: calculateTotalMinimumPayment(),
    averageInterestRate: calculateAverageInterestRate(),
    setPayoffStrategy,
    setAdditionalPayment,
    addDebt: handleAddDebt,
    updateDebt: handleUpdateDebt,
    makePayment,
    calculateMonthsToPayoff,
    compareStrategies,
    refreshDebts: fetchDebts
  };
};

export default useDebt;