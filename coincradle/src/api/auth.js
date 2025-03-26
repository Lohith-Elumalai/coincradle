// src/api/auth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AuthAPI {
  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/auth`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} User data and token
   */
  async register(userData) {
    try {
      const response = await this.client.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Log in a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} User data and token
   */
  async login(email, password) {
    try {
      const response = await this.client.post('/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Validate the user's token
   * @param {string} token - Auth token
   * @returns {Promise<object>} User data
   */
  async validateToken(token) {
    try {
      const response = await this.client.get('/validate', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Log out the user
   * @returns {Promise<object>} Result message
   */
  async logout() {
    try {
      const token = localStorage.getItem('financeAI_token');
      if (!token) return { message: 'Already logged out' };

      const response = await this.client.post(
        '/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Update user profile
   * @param {object} userData - User profile data to update
   * @returns {Promise<object>} Updated user data
   */
  async updateProfile(userData) {
    try {
      const token = localStorage.getItem('financeAI_token');
      if (!token) throw new Error('Not authenticated');

      const response = await this.client.put('/profile', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<object>} Result message
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('financeAI_token');
      if (!token) throw new Error('Not authenticated');

      const response = await this.client.put(
        '/password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<object>} Result message
   */
  async requestPasswordReset(email) {
    try {
      const response = await this.client.post('/reset-password', { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<object>} Result message
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await this.client.post('/reset-password/confirm', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error.response?.data || error;
    }
  }
}

export const auth = new AuthAPI();
export default auth;