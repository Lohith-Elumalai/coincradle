// src/api/bankApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class BankAPI {
  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/banking`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add authentication token to every request
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('financeAI_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Get list of available banks for connection
   * @returns {Promise<Array>} List of available banks
   */
  async getAvailableBanks() {
    try {
      const response = await this.client.get('/institutions');
      return response.data;
    } catch (error) {
      console.error('Error fetching available banks:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Authenticate with a bank using provided credentials
   * @param {string} bankId - ID of the bank to connect to
   * @param {object} credentials - User credentials for the bank
   * @returns {Promise<object>} Connection result with available accounts
   */
  async authenticateWithBank(bankId, credentials) {
    try {
      const response = await this.client.post(`/connect/${bankId}`, credentials);
      return response.data;
    } catch (error) {
      console.error('Error authenticating with bank:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Finalize bank connection with selected accounts
   * @param {object} connectionData - Connection data including selected accounts
   * @returns {Promise<object>} Connected accounts data
   */
  async finalizeConnection(connectionData) {
    try {
      const response = await this.client.post('/finalize-connection', connectionData);
      return response.data;
    } catch (error) {
      console.error('Error finalizing connection:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get transactions for connected accounts
   * @param {object} params - Query parameters for transactions (date range, etc.)
   * @returns {Promise<Array>} List of transactions
   */
  async getTransactions(params = {}) {
    try {
      const response = await this.client.get('/transactions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get balance history for an account
   * @param {string} accountId - ID of the account
   * @param {string} period - Period for history (day, week, month, year)
   * @returns {Promise<Array>} Balance history data
   */
  async getBalanceHistory(accountId, period = 'month') {
    try {
      const response = await this.client.get(`/accounts/${accountId}/balance-history`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching balance history:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Remove a connected account
   * @param {string} accountId - ID of the account to remove
   * @returns {Promise<object>} Result of removal operation
   */
  async removeAccount(accountId) {
    try {
      const response = await this.client.delete(`/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing account:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Refresh account data (transactions, balances)
   * @param {string} accountId - ID of the account to refresh
   * @returns {Promise<object>} Updated account data
   */
  async refreshAccount(accountId) {
    try {
      const response = await this.client.post(`/accounts/${accountId}/refresh`);
      return response.data;
    } catch (error) {
      console.error('Error refreshing account:', error);
      throw error.response?.data || error;
    }
  }
}

export const bankApi = new BankAPI();
export default bankApi;