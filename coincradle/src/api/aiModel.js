/**
 * AI Model Service
 * 
 * Handles interactions with AI models for financial insights and recommendations.
 * This service communicates with backend AI services and processes responses.
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';
import { getAuthHeaders } from './auth';

const BASE_URL = API_ENDPOINTS.AI_MODEL;

/**
 * Get personalized spending insights based on transaction history
 * @param {Object} params - Parameters for analysis
 * @param {Array} params.transactions - Transaction data
 * @param {string} params.timeframe - Analysis timeframe (week, month, quarter, year)
 * @param {boolean} params.includeTrends - Whether to include trend analysis
 * @returns {Promise<Object>} AI-generated spending insights
 */
export const getSpendingInsights = async ({ transactions, timeframe = 'month', includeTrends = true }) => {
    try {
      const response = await axios.post(`${BASE_URL}/insights/spending`, {
        transactions,
        timeframe,
        includeTrends
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting spending insights:', error);
      throw error;
    }
  };

/**
 * Get budget recommendations based on financial profile and goals
 * @param {Object} financialData - User's financial profile
 * @param {Object} financialData.income - Income details
 * @param {Object} financialData.expenses - Expense categories and amounts
 * @param {Array} financialData.goals - Financial goals
 * @returns {Promise<Object>} AI-generated budget recommendations
 */
export const getBudgetRecommendations = async (financialData) => {
  try {
    const response = await axios.post(`${BASE_URL}/recommendations/budget`, financialData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting budget recommendations:', error);
    throw error;
  }
};

/**
 * Get investment recommendations based on risk profile and goals
 * @param {Object} params - Parameters for recommendations
 * @param {Object} params.riskProfile - User's risk tolerance profile
 * @param {Array} params.goals - Investment goals and timeframes
 * @param {Object} params.currentInvestments - Current investment portfolio
 * @returns {Promise<Object>} AI-generated investment recommendations
 */
export const getInvestmentRecommendations = async ({ riskProfile, goals, currentInvestments }) => {
  try {
    const response = await axios.post(`${BASE_URL}/recommendations/investments`
        , {
      riskProfile,
      goals,
      currentInvestments
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting investment recommendations:', error);
    throw error;
  }
};

/**
 * Get debt repayment strategy recommendations
 * @param {Object} debtData - User's debt information
 * @param {Array} debtData.accounts - Debt accounts with balances, interest rates
 * @param {number} debtData.monthlyBudget - Available monthly budget for debt repayment
 * @param {string} debtData.preferredStrategy - User's preferred strategy (avalanche, snowball, etc.)
 * @returns {Promise<Object>} AI-generated debt repayment strategies
 */
export const getDebtRepaymentStrategies = async (debtData) => {
  try {
    const response = await axios.post(`${BASE_URL}/recommendations/debt`, debtData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting debt repayment strategies:', error);
    throw error;
  }
};

/**
 * Get savings recommendations based on goals and income
 * @param {Object} params - Parameters for recommendations
 * @param {Array} params.goals - Savings goals with timeframes
 * @param {Object} params.income - Income details
 * @param {Object} params.expenses - Current expense breakdown
 * @returns {Promise<Object>} AI-generated savings recommendations
 */
export const getSavingsRecommendations = async ({ goals, income, expenses }) => {
  try {
    const response = await axios.post(`${BASE_URL}/recommendations/savings`, {
      goals,
      income,
      expenses
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting savings recommendations:', error);
    throw error;
  }
};

/**
 * Process a natural language financial query and get an AI response
 * @param {string} query - User's natural language question about finances
 * @param {Object} context - User's financial context for personalized responses
 * @returns {Promise<Object>} AI response to the query
 */
export const processFinancialQuery = async (query, context) => {
  try {
    const response = await axios.post(`${BASE_URL}/chat/query`, {
      query,
      context
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error processing financial query:', error);
    throw error;
  }
};

/**
 * Get personalized financial education content recommendations
 * @param {Object} params - Parameters for content recommendations
 * @param {Object} params.userProfile - User's financial profile and knowledge level
 * @param {Array} params.interests - Financial topics of interest
 * @param {string} params.format - Preferred content format (articles, videos, etc.)
 * @returns {Promise<Object>} Recommended educational content
 */
export const getEducationRecommendations = async ({ userProfile, interests, format = 'all' }) => {
  try {
    const response = await axios.post(`${BASE_URL}/education/recommendations`, {
      userProfile,
      interests,
      format
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting education recommendations:', error);
    throw error;
  }
};

/**
 * Get AI analysis of financial risk factors
 * @param {Object} financialData - User's comprehensive financial data
 * @returns {Promise<Object>} Risk analysis and recommendations
 */
export const getFinancialRiskAnalysis = async (financialData) => {
  try {
    const response = await axios.post(`${BASE_URL}/analysis/risk`, financialData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting financial risk analysis:', error);
    throw error;
  }
};

/**
 * Get AI-generated financial forecasts and projections
 * @param {Object} params - Parameters for forecast
 * @param {Object} params.currentFinancials - Current financial status
 * @param {Array} params.assumptions - Assumptions for the forecast
 * @param {number} params.timeframe - Forecast timeframe in years
 * @returns {Promise<Object>} Financial forecasts and scenarios
 */
export const getFinancialForecasts = async ({ currentFinancials, assumptions, timeframe = 5 }) => {
  try {
    const response = await axios.post(`${BASE_URL}/forecasts`, {
      currentFinancials,
      assumptions,
      timeframe
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting financial forecasts:', error);
    throw error;
  }
};

/**
 * Get AI-powered retirement planning recommendations
 * @param {Object} retirementData - Retirement planning parameters
 * @param {number} retirementData.currentAge - Current age
 * @param {number} retirementData.retirementAge - Target retirement age
 * @param {Object} retirementData.currentSavings - Current retirement savings details
 * @param {Object} retirementData.monthlyContributions - Monthly contribution details
 * @param {Array} retirementData.accounts - Retirement accounts information
 * @returns {Promise<Object>} Retirement planning recommendations
 */
export const getRetirementRecommendations = async (retirementData) => {
  try {
    const response = await axios.post(`${BASE_URL}/recommendations/retirement`, retirementData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting retirement recommendations:', error);
    throw error;
  }
};

/**
 * Get transaction categorization from the AI model
 * @param {Array} transactions - Uncategorized transactions
 * @returns {Promise<Array>} Categorized transactions
 */
export const categorizeTransactions = async (transactions) => {
  try {
    const response = await axios.post(`${BASE_URL}/categorize/transactions`, { transactions }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error categorizing transactions:', error);
    throw error;
  }
};

/**
 * Get anomaly detection for unusual transactions or financial activities
 * @param {Array} transactions - Recent transactions to analyze
 * @param {Object} userProfile - User's financial behavior profile
 * @returns {Promise<Object>} Detected anomalies and explanations
 */
export const detectFinancialAnomalies = async (transactions, userProfile) => {
  try {
    const response = await axios.post(`${BASE_URL}/detect/anomalies`, {
      transactions,
      userProfile
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error detecting financial anomalies:', error);
    throw error;
  }
};

/**
 * Get AI feedback on financial decisions or plans
 * @param {Object} decision - Decision details
 * @param {string} decision.type - Type of decision (purchase, investment, etc.)
 * @param {Object} decision.details - Specific details about the decision
 * @param {Object} financialContext - User's financial context
 * @returns {Promise<Object>} AI feedback on the decision
 */
export const getDecisionFeedback = async (decision, financialContext) => {
  try {
    const response = await axios.post(`${BASE_URL}/feedback/decision`, {
      decision,
      financialContext
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting decision feedback:', error);
    throw error;
  }
};

export default {
    getSpendingInsights,
    getBudgetRecommendations,
    getInvestmentRecommendations,
    getDebtRepaymentStrategies,
    getSavingsRecommendations,
    processFinancialQuery,
    getEducationRecommendations,
    getFinancialRiskAnalysis,
    getFinancialForecasts,
    getRetirementRecommendations,
    categorizeTransactions,
    detectFinancialAnomalies,
    getDecisionFeedback
  };