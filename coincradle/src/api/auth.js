import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

const BASE_URL = API_ENDPOINTS.AUTH;

/**
 * Get authentication headers for API requests
 * @returns {Object} Headers object with authentication token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data with token
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user data
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Log out user
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get current user data
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/me`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<Object>} Response data
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise<Object>} Response data
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/reset-password`, {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await axios.put(`${BASE_URL}/profile`, userData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Verify email with token
 * @param {string} token - Verification token
 * @returns {Promise<Object>} Response data
 */
export const verifyEmail = async (token) => {
  try {
    const response = await axios.post(`${BASE_URL}/verify-email`, { token });
    return response.data;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

/**
 * Clear authentication token
 */
export const clearAuthToken = () => {
  localStorage.removeItem('token');
};

export default {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  verifyEmail,
  getAuthHeaders,
  clearAuthToken
};