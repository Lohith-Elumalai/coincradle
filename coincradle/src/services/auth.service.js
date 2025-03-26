// src/services/auth.service.js
import api from '../api/auth';
import { storage } from '../utils/storage';

const TOKEN_KEY = 'finance_auth_token';
const USER_KEY = 'finance_user';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.login({ email, password });
      if (response.token) {
        this.setAuthData(response.token, response.user);
      }
      return response;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await api.register(userData);
      if (response.token) {
        this.setAuthData(response.token, response.user);
      }
      return response;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      return await api.forgotPassword({ email });
    } catch (error) {
      console.error('Password reset request failed', error);
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      return await api.resetPassword({ token, newPassword });
    } catch (error) {
      console.error('Password reset failed', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const currentToken = this.getToken();
      if (!currentToken) {
        throw new Error('No token found');
      }
      
      const response = await api.refreshToken({ token: currentToken });
      if (response.token) {
        this.setAuthData(response.token, response.user);
      }
      return response;
    } catch (error) {
      console.error('Token refresh failed', error);
      this.logout(); // Logout on failed refresh
      throw error;
    }
  }

  logout() {
    storage.remove(TOKEN_KEY);
    storage.remove(USER_KEY);
    // Additional cleanup if needed
  }

  setAuthData(token, user) {
    storage.set(TOKEN_KEY, token);
    storage.set(USER_KEY, user);
  }

  getToken() {
    return storage.get(TOKEN_KEY);
  }

  getUser() {
    return storage.get(USER_KEY);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async updateUserProfile(userData) {
    try {
      const response = await api.updateProfile(userData);
      if (response.user) {
        const currentUser = this.getUser();
        this.setAuthData(this.getToken(), { ...currentUser, ...response.user });
      }
      return response;
    } catch (error) {
      console.error('Profile update failed', error);
      throw error;
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      return await api.changePassword({ currentPassword, newPassword });
    } catch (error) {
      console.error('Password change failed', error);
      throw error;
    }
  }
}

export default new AuthService();