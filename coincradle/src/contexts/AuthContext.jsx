// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { auth } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('financeAI_token');
        
        if (token) {
          // Validate token with server
          const user = await auth.validateToken(token);
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Auth validation error:', err);
        // Clear invalid token
        localStorage.removeItem('financeAI_token');
        setError('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user, token } = await auth.login(email, password);
      localStorage.setItem('financeAI_token', token);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user, token } = await auth.register(userData);
      localStorage.setItem('financeAI_token', token);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await auth.logout();
      localStorage.removeItem('financeAI_token');
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await auth.updateProfile(userData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;