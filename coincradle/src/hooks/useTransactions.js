// src/hooks/useTransactions.js
import { useState, useCallback, useMemo } from 'react';
import useFinanceData from './useFinanceData';
import useNotification from './useNotification';

/**
 * Custom hook to manage transaction-related operations
 * 
 * @returns {Object} Transaction-related state and methods
 */
const useTransactions = () => {
  const { 
    transactions, 
    fetchTransactions, 
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loading 
  } = useFinanceData();
  
  const { showSuccess, showError } = useNotification();
  
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    category: null,
    type: null,
    minAmount: null,
    maxAmount: null,
    searchQuery: ''
  });
  
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  
  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }
    
    return transactions.filter(transaction => {
      // Filter by date range
      if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
        return false;
      }
      
      if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
        return false;
      }
      
      // Filter by category
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }
      
      // Filter by type (income/expense)
      if (filters.type === 'income' && transaction.amount < 0) {
        return false;
      }
      
      if (filters.type === 'expense' && transaction.amount >= 0) {
        return false;
      }
      
      // Filter by amount range
      if (filters.minAmount !== null && Math.abs(transaction.amount) < filters.minAmount) {
        return false;
      }
      
      if (filters.maxAmount !== null && Math.abs(transaction.amount) > filters.maxAmount) {
        return false;
      }
      
      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesDescription = transaction.description?.toLowerCase().includes(query);
        const matchesMerchant = transaction.merchant?.toLowerCase().includes(query);
        
        if (!matchesDescription && !matchesMerchant) {
          return false;
        }
      }
      
      return true;
    });
  }, [transactions, filters]);
  
  // Sort transactions
  const sortedTransactions = useMemo(() => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      return [];
    }
    
    const sorted = [...filteredTransactions];
    
    sorted.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc'
          ? Math.abs(a.amount) - Math.abs(b.amount)
          : Math.abs(b.amount) - Math.abs(a.amount);
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      
      return 0;
    });
    
    return sorted;
  }, [filteredTransactions, sortConfig]);
  
  // Apply filters
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);
  
  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      startDate: null,
      endDate: null,
      category: null,
      type: null,
      minAmount: null,
      maxAmount: null,
      searchQuery: ''
    });
  }, []);
  
  // Set sort config
  const sortBy = useCallback((key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        // Toggle direction if same key
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      
      // Default to descending for new key
      return {
        key,
        direction: 'desc'
      };
    });
  }, []);
  
  // Refresh transactions with current filters
  const refreshTransactions = useCallback(async () => {
    try {
      await fetchTransactions(filters);
    } catch (err) {
      showError('Failed to refresh transactions: ' + (err.message || 'Unknown error'));
    }
  }, [fetchTransactions, filters, showError]);
  
  // Add a new transaction
  const createTransaction = useCallback(async (transactionData) => {
    try {
      const newTransaction = await addTransaction(transactionData);
      showSuccess('Transaction added successfully');
      return newTransaction;
    } catch (err) {
      showError('Failed to add transaction: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }, [addTransaction, showSuccess, showError]);
  
  // Edit a transaction
  const editTransaction = useCallback(async (transactionId, transactionData) => {
    try {
      const updatedTransaction = await updateTransaction(transactionId, transactionData);
      showSuccess('Transaction updated successfully');
      return updatedTransaction;
    } catch (err) {
      showError('Failed to update transaction: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }, [updateTransaction, showSuccess, showError]);
  
  // Remove a transaction
  const removeTransaction = useCallback(async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
      showSuccess('Transaction deleted successfully');
    } catch (err) {
      showError('Failed to delete transaction: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }, [deleteTransaction, showSuccess, showError]);
  
  // Get unique categories
  const uniqueCategories = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }
    
    const categories = new Set();
    
    transactions.forEach(transaction => {
      if (transaction.category) {
        categories.add(transaction.category);
      }
    });
    
    return Array.from(categories).sort();
  }, [transactions]);
  
  // Calculate total income, expenses and balance
  const calculateSummary = useMemo(() => {
    let income = 0;
    let expenses = 0;
    
    filteredTransactions.forEach(transaction => {
      if (transaction.amount >= 0) {
        income += transaction.amount;
      } else {
        expenses += Math.abs(transaction.amount);
      }
    });
    
    const balance = income - expenses;
    
    return {
      income,
      expenses,
      balance
    };
  }, [filteredTransactions]);
  
  return {
    transactions: sortedTransactions,
    allTransactions: transactions,
    loading: loading.transactions,
    filters,
    sortConfig,
    applyFilters,
    resetFilters,
    sortBy,
    refreshTransactions,
    createTransaction,
    editTransaction,
    removeTransaction,
    uniqueCategories,
    summary: calculateSummary
  };
};

export default useTransactions;