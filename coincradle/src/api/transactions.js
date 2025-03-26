import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class TransactionAPI {
  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/transactions`,
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
   * Get user transactions
   * @param {Object} filters - Transaction filters (date range, category, etc.)
   * @returns {Promise<Array>} List of transactions
   */
  async getTransactions(filters = {}) {
    try {
      const response = await this.client.get('/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Add a manual transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise<Object>} Created transaction
   */
  async addTransaction(transactionData) {
    try {
      const response = await this.client.post('/', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Update a transaction
   * @param {string} id - Transaction ID
   * @param {Object} transactionData - Transaction data to update
   * @returns {Promise<Object>} Updated transaction
   */
  async updateTransaction(id, transactionData) {
    try {
      const response = await this.client.put(`/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Delete a transaction
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteTransaction(id) {
    try {
      const response = await this.client.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Categorize transactions using AI
   * @param {Array} transactions - Transactions to categorize
   * @returns {Promise<Array>} Categorized transactions
   */
  async categorizeTransactions(transactions) {
    try {
      const response = await this.client.post('/categorize', { transactions });
      return response.data;
    } catch (error) {
      console.error('Error categorizing transactions:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get transaction statistics
   * @param {Object} params - Statistic parameters (timeframe, groupBy, etc.)
   * @returns {Promise<Object>} Transaction statistics
   */
  async getStatistics(params = {}) {
    try {
      const response = await this.client.get('/statistics', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction statistics:', error);
      throw error.response?.data || error;
    }
  }
}

export const transactionApi = new TransactionAPI();
export default transactionApi;