/**
 * Utility functions for local storage management in the finance-ai app
 */

// Storage keys used throughout the application
const STORAGE_KEYS = {
    AUTH_TOKEN: 'finance_ai_auth_token',
    USER_DATA: 'finance_ai_user_data',
    USER_PREFERENCES: 'finance_ai_preferences',
    RECENT_SEARCHES: 'finance_ai_recent_searches',
    CONNECTED_ACCOUNTS: 'finance_ai_connected_accounts',
    LAST_SYNC: 'finance_ai_last_sync',
    THEME: 'finance_ai_theme',
    TUTORIAL_COMPLETED: 'finance_ai_tutorial_completed',
    CACHED_TRANSACTIONS: 'finance_ai_cached_transactions',
    BUDGET_DATA: 'finance_ai_budget_data',
    SESSION_EXPIRES: 'finance_ai_session_expires',
    REMEMBER_ME: 'finance_ai_remember_me',
    LANGUAGE: 'finance_ai_language',
  };
  
  /**
   * Gets an item from localStorage with optional JSON parsing
   * @param {string} key - Storage key
   * @param {boolean} parse - Whether to parse as JSON (default: true)
   * @returns {*} Retrieved value or null if not found
   */
  export const getItem = (key, parse = true) => {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return null;
      return parse ? JSON.parse(value) : value;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  };
  
  /**
   * Sets an item in localStorage with automatic JSON stringification
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @param {boolean} stringify - Whether to stringify value (default: true)
   * @returns {boolean} Whether the operation was successful
   */
  export const setItem = (key, value, stringify = true) => {
    try {
      const storageValue = stringify ? JSON.stringify(value) : value;
      localStorage.setItem(key, storageValue);
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
      return false;
    }
  };
  
  /**
   * Removes an item from localStorage
   * @param {string} key - Storage key to remove
   * @returns {boolean} Whether the operation was successful
   */
  export const removeItem = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
      return false;
    }
}
