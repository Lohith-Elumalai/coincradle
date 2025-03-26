// src/contexts/FinanceDataContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import { financeApi } from '../api/finance';
import { transactionApi } from '../api/transactions';

export const FinanceDataContext = createContext();

export const FinanceDataProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  
  // Financial states
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [debts, setDebts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState(null);
  
  // Loading states for different data types
  const [loading, setLoading] = useState({
    transactions: false,
    accounts: false,
    budgets: false,
    investments: false,
    debts: false,
    goals: false,
    insights: false
  });
  
  // Error state
  const [error, setError] = useState(null);

  // Fetch user's financial data when authenticated
  useEffect(() => {
    if (currentUser) {
      fetchFinancialData();
    } else {
      // Reset data when logged out
      resetFinancialData();
    }
  }, [currentUser]);

  // Function to fetch all financial data
  const fetchFinancialData = async () => {
    if (!currentUser) return;
    
    setError(null);
    
    // Fetch accounts
    fetchAccounts();
    
    // Fetch transactions
    fetchTransactions();
    
    // Fetch budgets
    fetchBudgets();
    
    // Fetch investments
    fetchInvestments();
    
    // Fetch debts
    fetchDebts();
    
    // Fetch goals
    fetchGoals();
    
    // Generate AI insights
    generateInsights();
  };

  // Reset all financial data
  const resetFinancialData = () => {
    setTransactions([]);
    setAccounts([]);
    setBudgets([]);
    setInvestments([]);
    setDebts([]);
    setGoals([]);
    setInsights(null);
  };

  // Fetch accounts
  const fetchAccounts = async () => {
    setLoading(prev => ({ ...prev, accounts: true }));
    try {
      const accountsData = await financeApi.getAccounts();
      setAccounts(accountsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch account data');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(prev => ({ ...prev, accounts: false }));
    }
  };

  // Fetch transactions
  const fetchTransactions = async (filters = {}) => {
    setLoading(prev => ({ ...prev, transactions: true }));
    try {
      const transactionsData = await transactionApi.getTransactions(filters);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch transaction data');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  // Fetch budgets
  const fetchBudgets = async () => {
    setLoading(prev => ({ ...prev, budgets: true }));
    try {
      const budgetsData = await financeApi.getBudgets();
      setBudgets(budgetsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch budget data');
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(prev => ({ ...prev, budgets: false }));
    }
  };

  // Fetch investments
  const fetchInvestments = async () => {
    setLoading(prev => ({ ...prev, investments: true }));
    try {
      const investmentsData = await financeApi.getInvestments();
      setInvestments(investmentsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch investment data');
      console.error('Error fetching investments:', err);
    } finally {
      setLoading(prev => ({ ...prev, investments: false }));
    }
  };

  // Fetch debts
  const fetchDebts = async () => {
    setLoading(prev => ({ ...prev, debts: true }));
    try {
      const debtsData = await financeApi.getDebts();
      setDebts(debtsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch debt data');
      console.error('Error fetching debts:', err);
    } finally {
      setLoading(prev => ({ ...prev, debts: false }));
    }
  };

  // Fetch goals
  const fetchGoals = async () => {
    setLoading(prev => ({ ...prev, goals: true }));
    try {
      const goalsData = await financeApi.getGoals();
      setGoals(goalsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch goal data');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(prev => ({ ...prev, goals: false }));
    }
  };

  // Generate AI insights
  const generateInsights = async () => {
    setLoading(prev => ({ ...prev, insights: true }));
    try {
      const insightsData = await financeApi.generateInsights();
      setInsights(insightsData);
    } catch (err) {
      setError(err.message || 'Failed to generate insights');
      console.error('Error generating insights:', err);
    } finally {
      setLoading(prev => ({ ...prev, insights: false }));
    }
  };

  // Create or update budget
  const saveBudget = async (budgetData) => {
    try {
      const savedBudget = await financeApi.saveBudget(budgetData);
      setBudgets(prev => {
        const index = prev.findIndex(b => b.id === savedBudget.id);
        if (index >= 0) {
          // Update existing budget
          const updated = [...prev];
          updated[index] = savedBudget;
          return updated;
        } else {
          // Add new budget
          return [...prev, savedBudget];
        }
      });
      return savedBudget;
    } catch (err) {
      setError(err.message || 'Failed to save budget');
      throw err;
    }
  };

  // Connect bank account
  const connectBankAccount = async (bankCredentials) => {
    try {
      const result = await financeApi.connectBank(bankCredentials);
      // Refresh accounts after connecting
      fetchAccounts();
      // Refresh transactions after connecting
      fetchTransactions();
      return result;
    } catch (err) {
      setError(err.message || 'Failed to connect bank account');
      throw err;
    }
  };

  // Create financial goal
  const createGoal = async (goalData) => {
    try {
      const newGoal = await financeApi.createGoal(goalData);
      setGoals(prev => [...prev, newGoal]);
      return newGoal;
    } catch (err) {
      setError(err.message || 'Failed to create goal');
      throw err;
    }
  };

  // Update a goal
  const updateGoal = async (goalId, goalData) => {
    try {
      const updatedGoal = await financeApi.updateGoal(goalId, goalData);
      setGoals(prev => 
        prev.map(goal => goal.id === goalId ? updatedGoal : goal)
      );
      return updatedGoal;
    } catch (err) {
      setError(err.message || 'Failed to update goal');
      throw err;
    }
  };

  // Delete a goal
  const deleteGoal = async (goalId) => {
    try {
      await financeApi.deleteGoal(goalId);
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (err) {
      setError(err.message || 'Failed to delete goal');
      throw err;
    }
  };

  // Add an investment
  const addInvestment = async (investmentData) => {
    try {
      const newInvestment = await financeApi.addInvestment(investmentData);
      setInvestments(prev => [...prev, newInvestment]);
      return newInvestment;
    } catch (err) {
      setError(err.message || 'Failed to add investment');
      throw err;
    }
  };

  // Update an investment
  const updateInvestment = async (investmentId, investmentData) => {
    try {
      const updatedInvestment = await financeApi.updateInvestment(investmentId, investmentData);
      setInvestments(prev => 
        prev.map(investment => investment.id === investmentId ? updatedInvestment : investment)
      );
      return updatedInvestment;
    } catch (err) {
      setError(err.message || 'Failed to update investment');
      throw err;
    }
  };

  // Add debt
  const addDebt = async (debtData) => {
    try {
      const newDebt = await financeApi.addDebt(debtData);
      setDebts(prev => [...prev, newDebt]);
      return newDebt;
    } catch (err) {
      setError(err.message || 'Failed to add debt');
      throw err;
    }
  };

  // Update debt
  const updateDebt = async (debtId, debtData) => {
    try {
      const updatedDebt = await financeApi.updateDebt(debtId, debtData);
      setDebts(prev => 
        prev.map(debt => debt.id === debtId ? updatedDebt : debt)
      );
      return updatedDebt;
    } catch (err) {
      setError(err.message || 'Failed to update debt');
      throw err;
    }
  };

  // Get spending trends
  const getSpendingTrends = async (period = 'month') => {
    try {
      return await financeApi.getSpendingTrends(period);
    } catch (err) {
      setError(err.message || 'Failed to fetch spending trends');
      throw err;
    }
  };

  // Get AI recommendations
  const getRecommendations = async (type = 'all') => {
    try {
      return await financeApi.getRecommendations(type);
    } catch (err) {
      setError(err.message || 'Failed to get recommendations');
      throw err;
    }
  };

  // Add manual transaction
  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionApi.addTransaction(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err.message || 'Failed to add transaction');
      throw err;
    }
  };

  // Update transaction
  const updateTransaction = async (transactionId, transactionData) => {
    try {
      const updatedTransaction = await transactionApi.updateTransaction(transactionId, transactionData);
      setTransactions(prev => 
        prev.map(transaction => transaction.id === transactionId ? updatedTransaction : transaction)
      );
      return updatedTransaction;
    } catch (err) {
      setError(err.message || 'Failed to update transaction');
      throw err;
    }
  };

  // Delete transaction
  const deleteTransaction = async (transactionId) => {
    try {
      await transactionApi.deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
    } catch (err) {
      setError(err.message || 'Failed to delete transaction');
      throw err;
    }
  };

  const value = {
    transactions,
    accounts,
    budgets,
    investments,
    debts,
    goals,
    insights,
    loading,
    error,
    fetchTransactions,
    fetchAccounts,
    fetchBudgets,
    fetchInvestments,
    fetchDebts,
    fetchGoals,
    generateInsights,
    saveBudget,
    connectBankAccount,
    createGoal,
    updateGoal,
    deleteGoal,
    addInvestment,
    updateInvestment,
    addDebt,
    updateDebt,
    getSpendingTrends,
    getRecommendations,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setError
  };

  return (
    <FinanceDataContext.Provider value={value}>
      {children}
    </FinanceDataContext.Provider>
  );
};

export default FinanceDataContext;