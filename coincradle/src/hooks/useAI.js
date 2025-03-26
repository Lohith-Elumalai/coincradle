// src/hooks/useAI.js
import { useState, useEffect, useContext, useCallback } from 'react';
import FinanceDataContext from '../contexts/FinanceDataContext';
import AuthContext from '../contexts/AuthContext';
import { aiService } from '../services/ai.service';

/**
 * Hook for AI functionality throughout the application
 * Provides methods for AI-powered insights, recommendations, and analysis
 */
const useAI = () => {
  const { currentUser } = useContext(AuthContext);
  const { 
    transactions, 
    accounts, 
    budgets, 
    investments, 
    debts, 
    goals, 
    insights 
  } = useContext(FinanceDataContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Load chat history when user changes
  useEffect(() => {
    if (currentUser) {
      loadChatHistory();
    } else {
      setChatHistory([]);
    }
  }, [currentUser]);

  // Load chat history from API
  const loadChatHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const history = await aiService.getChatHistory();
      setChatHistory(history);
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError('Failed to load chat history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Send message to AI assistant
  const sendMessage = async (message, context = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create default context with user's financial data
      const defaultContext = {
        transactions: transactions.slice(0, 50), // Limit to recent transactions
        accounts,
        budgets,
        investments,
        debts,
        goals,
        insights
      };
      
      // Merge with custom context if provided
      const mergedContext = {
        ...defaultContext,
        ...context
      };
      
      const response = await aiService.sendMessage(message, mergedContext);
      
      // Add the user message and AI response to chat history
      const updatedHistory = [
        ...chatHistory,
        {
          id: `user-${Date.now()}`,
          sender: 'user',
          content: message,
          timestamp: new Date().toISOString()
        },
        {
          id: `ai-${Date.now() + 1}`,
          sender: 'ai',
          content: response.message,
          suggestions: response.suggestions || [],
          timestamp: new Date().toISOString()
        }
      ];
      
      setChatHistory(updatedHistory);
      return response;
    } catch (err) {
      console.error('Error sending message to AI:', err);
      setError('Failed to get AI response. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate financial insights
  const generateInsights = async (data = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Default data includes all financial information
      const defaultData = {
        transactions,
        accounts,
        budgets,
        investments,
        debts,
        goals
      };
      
      // Merge with custom data if provided
      const mergedData = {
        ...defaultData,
        ...data
      };
      
      const result = await aiService.generateInsights(mergedData);
      return result;
    } catch (err) {
      console.error('Error generating insights:', err);
      setError('Failed to generate insights. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get personalized financial recommendations
  const getRecommendations = async (category = 'all') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiService.getRecommendations(category);
      setRecommendations(result);
      return result;
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to get recommendations. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Analyze spending patterns
  const analyzeSpending = async (transactionData = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use provided transaction data or fallback to context data
      const dataToAnalyze = transactionData || transactions;
      
      const result = await aiService.analyzeSpending(dataToAnalyze);
      setAnalysisResults(prev => ({
        ...prev,
        spending: result
      }));
      return result;
    } catch (err) {
      console.error('Error analyzing spending:', err);
      setError('Failed to analyze spending. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate budget plan
  const generateBudgetPlan = async (financialData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Default data includes relevant financial information
      const defaultData = {
        transactions,
        accounts,
        currentBudgets: budgets
      };
      
      // Merge with custom data if provided
      const mergedData = {
        ...defaultData,
        ...financialData
      };
      
      const result = await aiService.generateBudgetPlan(mergedData);
      return result;
    } catch (err) {
      console.error('Error generating budget plan:', err);
      setError('Failed to generate budget plan. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create debt payment plan
  const createDebtPaymentPlan = async (debtData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Default data includes debts from context
      const defaultData = {
        debts,
        income: calculateTotalIncome(),
        expenses: calculateTotalExpenses()
      };
      
      // Merge with custom data if provided
      const mergedData = {
        ...defaultData,
        ...debtData
      };
      
      const result = await aiService.createDebtPaymentPlan(mergedData);
      return result;
    } catch (err) {
      console.error('Error creating debt payment plan:', err);
      setError('Failed to create debt payment plan. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get investment recommendations
  const getInvestmentRecommendations = async (investorProfile = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Default data includes investments from context
      const defaultData = {
        portfolio: investments,
        risk: investorProfile.risk || 'moderate',
        goals: goals.filter(goal => goal.category === 'investment' || goal.category === 'retirement')
      };
      
      // Merge with custom data if provided
      const mergedData = {
        ...defaultData,
        ...investorProfile
      };
      
      const result = await aiService.getInvestmentRecommendations(mergedData);
      return result;
    } catch (err) {
      console.error('Error getting investment recommendations:', err);
      setError('Failed to get investment recommendations. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Analyze financial goals
  const analyzeGoal = async (goalData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Default data includes relevant financial information
      const defaultData = {
        accounts,
        goals,
        transactions,
        income: calculateTotalIncome()
      };
      
      // Merge with custom data if provided
      const mergedData = {
        ...defaultData,
        ...goalData
      };
      
      const result = await aiService.analyzeGoal(mergedData);
      return result;
    } catch (err) {
      console.error('Error analyzing goal:', err);
      setError('Failed to analyze goal. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Categorize transactions using AI
  const categorizeTransactions = async (uncategorizedTransactions) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use similar transaction data for context
      const result = await aiService.categorizeTransactions(uncategorizedTransactions);
      return result;
    } catch (err) {
      console.error('Error categorizing transactions:', err);
      setError('Failed to categorize transactions. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const calculateTotalIncome = useCallback(() => {
    if (!transactions || transactions.length === 0) return 0;
    
    // Sum positive transactions in the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return transactions
      .filter(t => 
        new Date(t.date) >= oneMonthAgo && 
        t.amount > 0 &&
        (t.category === 'Income' || t.category === 'income')
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const calculateTotalExpenses = useCallback(() => {
    if (!transactions || transactions.length === 0) return 0;
    
    // Sum negative transactions in the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return transactions
      .filter(t => 
        new Date(t.date) >= oneMonthAgo && 
        t.amount < 0 &&
        t.category !== 'Transfer'
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactions]);

  return {
    loading,
    error,
    chatHistory,
    recommendations,
    analysisResults,
    insights,
    sendMessage,
    generateInsights,
    getRecommendations,
    analyzeSpending,
    generateBudgetPlan,
    createDebtPaymentPlan,
    getInvestmentRecommendations,
    analyzeGoal,
    categorizeTransactions,
    calculateTotalIncome,
    calculateTotalExpenses
  };
};

export default useAI;