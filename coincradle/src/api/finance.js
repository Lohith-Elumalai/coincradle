import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class FinanceAPI {
  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/finance`,
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
   * Get user accounts
   * @returns {Promise<Array>} List of accounts
   */
  async getAccounts() {
    try {
      const response = await this.client.get('/accounts');
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get user budgets
   * @returns {Promise<Array>} List of budgets
   */
  async getBudgets() {
    try {
      const response = await this.client.get('/budgets');
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Save a budget
   * @param {Object} budgetData - Budget data to save
   * @returns {Promise<Object>} Saved budget
   */
  async saveBudget(budgetData) {
    try {
      const method = budgetData.id ? 'put' : 'post';
      const url = budgetData.id ? `/budgets/${budgetData.id}` : '/budgets';
      
      const response = await this.client[method](url, budgetData);
      return response.data;
    } catch (error) {
      console.error('Error saving budget:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get user investments
   * @returns {Promise<Array>} List of investments
   */
  async getInvestments() {
    try {
      const response = await this.client.get('/investments');
      return response.data;
    } catch (error) {
      console.error('Error fetching investments:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get user debts
   * @returns {Promise<Array>} List of debts
   */
  async getDebts() {
    try {
      const response = await this.client.get('/debts');
      return response.data;
    } catch (error) {
      console.error('Error fetching debts:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get user goals
   * @returns {Promise<Array>} List of financial goals
   */
  async getGoals() {
    try {
      const response = await this.client.get('/goals');
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Create a financial goal
   * @param {Object} goalData - Goal data
   * @returns {Promise<Object>} Created goal
   */
  async createGoal(goalData) {
    try {
      const response = await this.client.post('/goals', goalData);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Generate AI insights based on financial data
   * @returns {Promise<Object>} Financial insights
   */
  async generateInsights() {
    try {
      const response = await this.client.get('/insights');
      return response.data;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Connect to a bank
   * @param {Object} connectionData - Bank connection data
   * @returns {Promise<Object>} Connection result
   */
  async connectBank(connectionData) {
    try {
      const response = await this.client.post('/connect-bank', connectionData);
      return response.data;
    } catch (error) {
      console.error('Error connecting to bank:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get spending trends
   * @param {string} period - Period for trends (day, week, month, year)
   * @returns {Promise<Object>} Spending trends data
   */
  async getSpendingTrends(period = 'month') {
    try {
      const response = await this.client.get('/spending-trends', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching spending trends:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get AI recommendations
   * @param {string} type - Type of recommendations
   * @returns {Promise<Array>} Recommendations
   */
  async getRecommendations(type = 'all') {
    try {
      const response = await this.client.get('/recommendations', {
        params: { type }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get portfolio performance
   * @param {string} timeframe - Timeframe for performance data
   * @returns {Promise<Object>} Portfolio performance data
   */
  async getPortfolioPerformance(timeframe = '1m') {
    try {
      const response = await this.client.get('/investments/performance', {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio performance:', error);
      throw error.response?.data || error;
    }
  }
}

export const financeApi = new FinanceAPI();
export default financeApi;