// src/hooks/useNotification.js
import { useContext } from 'react';
import NotificationContext from '../contexts/NotificationContext';

/**
 * Custom hook to access and use notification context functionality
 * 
 * @returns {Object} Notification context values and methods
 */
const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

export default useNotification;