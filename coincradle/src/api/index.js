/**
 * API Services Index
 * 
 * Central export point for all API services in the financial wellness platform.
 * This file imports and re-exports all API modules for easier imports throughout the application.
 */

// Auth services
import * as authService from './auth';

// Core financial data services
import * as financeService from './finance';
import * as transactionsService from './transactions';
import * as budgetService from './budgetApi';

// Integration services
import * as bankApiService from './bankApi';

// AI and insights services
import * as aiModelService from './aiModel';

// Export individual services
export const auth = authService;
export const finance = financeService;
export const transactions = transactionsService;
export const budget = budgetService;
export const bankApi = bankApiService;
export const aiModel = aiModelService;

/**
 * Initialize all API services
 * @param {Object} config - Configuration options
 * @param {string} config.baseUrl - Base URL for API endpoints
 * @param {Object} config.headers - Default headers to include in requests
 * @param {boolean} config.useMocks - Whether to use mock data (for development)
 * @param {number} config.timeout - Request timeout in milliseconds
 * @returns {Object} Initialized API services
 */
export const initializeApi = (config = {}) => {
  // Set up any global configuration for API services
  // This could include setting base URLs, default headers, etc.
  
  if (config.baseUrl) {
    // Configure axios base URL globally if needed
    // Or pass to individual services
  }
  
  // Initialize services that require setup
  if (config.useMocks) {
    // Set up mock services for development/testing
    console.log('API services running in mock mode');
  }
  
  return {
    auth: authService,
    finance: financeService,
    transactions: transactionsService,
    budget: budgetService,
    bankApi: bankApiService,
    aiModel: aiModelService,
  };
};

/**
 * Reset API services (useful for logout or testing)
 */
export const resetApiServices = () => {
  // Clean up any service state, tokens, etc.
  authService.clearAuthToken();
  // Reset other services if needed
};

// Default export as an object with all services
export default {
  auth: authService,
  finance: financeService,
  transactions: transactionsService,
  budget: budgetService,
  bankApi: bankApiService,
  aiModel: aiModelService,
  initializeApi,
  resetApiServices
};