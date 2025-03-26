// src/hooks/useBudget.js
import { useState, useCallback } from 'react';
import useFinanceData from './useFinanceData';
import useNotification from './useNotification';

/**
 * Custom hook to manage budget-related operations
 * 
 * @returns {Object} Budget-related state and methods
 */
const useBudget = () => {
  const { budgets, saveBudget, loading } = useFinanceData();
  const { showSuccess, showError } = useNotification();
  
  const [currentBudget, setCurrentBudget] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Find current month's budget
  const getCurrentMonthBudget = useCallback(() => {
    if (!budgets || budgets.length === 0) return null;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    return budgets.find(budget => {
      const budgetDate = new Date(budget.month);
      return budgetDate.getFullYear() === currentYear && 
             budgetDate.getMonth() === currentMonth;
    });
  }, [budgets]);
  
  // Calculate total budget allocated
  const calculateTotalAllocated = useCallback((budget) => {
    if (!budget || !budget.categories || budget.categories.length === 0) {
      return 0;
    }
    
    return budget.categories.reduce((total, category) => total + category.limit, 0);
  }, []);
  
  // Calculate total spent
  const calculateTotalSpent = useCallback((budget) => {
    if (!budget || !budget.categories || budget.categories.length === 0) {
      return 0;
    }
    
    return budget.categories.reduce((total, category) => total + (category.spent || 0), 0);
  }, []);
  
  // Calculate remaining budget
  const calculateRemaining = useCallback((budget) => {
    const totalAllocated = calculateTotalAllocated(budget);
    const totalSpent = calculateTotalSpent(budget);
    return totalAllocated - totalSpent;
  }, [calculateTotalAllocated, calculateTotalSpent]);
  
  // Create a new budget
  const createBudget = useCallback(async (budgetData) => {
    try {
      const newBudget = await saveBudget({
        ...budgetData,
        month: new Date().toISOString()
      });
      showSuccess('Budget created successfully');
      return newBudget;
    } catch (err) {
      showError('Failed to create budget: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }, [saveBudget, showSuccess, showError]);
  
  // Update a budget
  const updateBudget = useCallback(async (budgetId, budgetData) => {
    try {
      const updatedBudget = await saveBudget({
        ...budgetData,
        id: budgetId
      });
      showSuccess('Budget updated successfully');
      return updatedBudget;
    } catch (err) {
      showError('Failed to update budget: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }, [saveBudget, showSuccess, showError]);
  
  // Initialize current budget
  useCallback(() => {
    const budget = getCurrentMonthBudget();
    if (budget) {
      setCurrentBudget(budget);
    }
  }, [getCurrentMonthBudget]);
  
  // Calculate budget percentage
  const calculateBudgetPercentage = useCallback((budget) => {
    const totalAllocated = calculateTotalAllocated(budget);
    if (totalAllocated === 0) return 0;
    
    const totalSpent = calculateTotalSpent(budget);
    return (totalSpent / totalAllocated) * 100;
  }, [calculateTotalAllocated, calculateTotalSpent]);
  
  // Get category status
  const getCategoryStatus = useCallback((category) => {
    if (!category) return 'normal';
    
    const spent = category.spent || 0;
    const percentUsed = (spent / category.limit) * 100;
    
    if (percentUsed >= 100) return 'over';
    if (percentUsed >= 90) return 'warning';
    if (percentUsed >= 75) return 'caution';
    return 'normal';
  }, []);
  
  return {
    budgets,
    currentBudget,
    setCurrentBudget,
    editMode,
    setEditMode,
    loading: loading.budgets,
    getCurrentMonthBudget,
    calculateTotalAllocated,
    calculateTotalSpent,
    calculateRemaining,
    calculateBudgetPercentage,
    getCategoryStatus,
    createBudget,
    updateBudget
  };
};

export default useBudget;