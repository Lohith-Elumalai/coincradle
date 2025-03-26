/**
 * Budget API Service
 * 
 * Handles all API requests related to budget management, including:
 * - Fetching budget data
 * - Creating and updating budgets
 * - Managing budget categories
 * - Getting budget recommendations from AI
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';
import { getAuthHeaders } from './auth';

const BASE_URL = API_ENDPOINTS.BUDGET;

/**
 * Fetch the user's current budget
 * @returns {Promise<Object>} Budget data including categories and allocations
 */
export const fetchUserBudget = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/current`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user budget:', error);
    throw error;
  }
};

/**
 * Fetch budget history for a specific time period
 * @param {string} period - Time period (month, quarter, year)
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {Promise<Array>} Array of budget periods with associated data
 */
export const fetchBudgetHistory = async (period = 'month', startDate, endDate) => {
  try {
    const response = await axios.get(`${BASE_URL}/history`, {
      headers: getAuthHeaders(),
      params: { period, startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching budget history:', error);
    throw error;
  }
};

/**
 * Create a new budget or update existing budget
 * @param {Object} budgetData - Budget data including allocations
 * @returns {Promise<Object>} Created or updated budget
 */
export const saveUserBudget = async (budgetData) => {
  try {
    const response = await axios.post(`${BASE_URL}/save`, budgetData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error saving budget:', error);
    throw error;
  }
};

/**
 * Get AI-generated budget recommendations based on user's financial data
 * @param {Object} financialData - User's financial data including income, expenses, and goals
 * @returns {Promise<Object>} Budget recommendations
 */
export const getAIBudgetRecommendations = async (financialData) => {
  try {
    const response = await axios.post(`${BASE_URL}/ai-recommendations`, financialData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting AI budget recommendations:', error);
    throw error;
  }
};

/**
 * Get budget categories including default ones and user-created ones
 * @returns {Promise<Array>} Array of budget categories
 */
export const getBudgetCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching budget categories:', error);
    throw error;
  }
};

/**
 * Create a new budget category
 * @param {Object} categoryData - Category data (name, icon, type, etc.)
 * @returns {Promise<Object>} Created category
 */
export const createBudgetCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${BASE_URL}/categories`, categoryData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating budget category:', error);
    throw error;
  }
};

/**
 * Update an existing budget category
 * @param {string} categoryId - ID of the category to update
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export const updateBudgetCategory = async (categoryId, categoryData) => {
  try {
    const response = await axios.put(`${BASE_URL}/categories/${categoryId}`, categoryData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating budget category:', error);
    throw error;
  }
};

/**
 * Delete a budget category
 * @param {string} categoryId - ID of the category to delete
 * @returns {Promise<Object>} Result of deletion
 */
export const deleteBudgetCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/categories/${categoryId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting budget category:', error);
    throw error;
  }
};

/**
 * Get budget performance analysis comparing budget to actual spending
 * @param {string} period - Time period (month, quarter, year)
 * @param {string} date - Reference date for the period
 * @returns {Promise<Object>} Budget performance analysis
 */
export const getBudgetPerformance = async (period = 'month', date = new Date().toISOString()) => {
  try {
    const response = await axios.get(`${BASE_URL}/performance`, {
      headers: getAuthHeaders(),
      params: { period, date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching budget performance:', error);
    throw error;
  }
};

/**
 * Get trending analysis of budget categories over time
 * @param {Array} categoryIds - Array of category IDs to analyze (optional)
 * @param {number} months - Number of months for trend analysis
 * @returns {Promise<Object>} Trend analysis data
 */
export const getBudgetTrends = async (categoryIds = [], months = 6) => {
  try {
    const response = await axios.get(`${BASE_URL}/trends`, {
      headers: getAuthHeaders(),
      params: { categoryIds: categoryIds.join(','), months }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching budget trends:', error);
    throw error;
  }
};

/**
 * Set up automatic budget adjustments based on income changes
 * @param {Object} adjustmentRules - Rules for automatic adjustments
 * @returns {Promise<Object>} Confirmation and rules summary
 */
export const setupAutomaticBudgetAdjustments = async (adjustmentRules) => {
  try {
    const response = await axios.post(`${BASE_URL}/auto-adjust`, adjustmentRules, {
      headers: getAuthHeaders()````
    });
    return response.data;
  } catch (error) {
    console.error('Error setting up budget adjustments:', error);
    throw error;
  }
};

export default {
  fetchUserBudget,
  fetchBudgetHistory,
  saveUserBudget,
  getAIBudgetRecommendations,
  getBudgetCategories,
  createBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory,
  getBudgetPerformance,
  getBudgetTrends,
  setupAutomaticBudgetAdjustments
};