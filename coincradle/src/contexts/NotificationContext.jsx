// src/contexts/NotificationContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Generate a unique ID for each notification
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const id = generateId();
    const newNotification = {
      id,
      title: notification.title || 'Notification',
      message: notification.message || '',
      type: notification.type || 'info', // 'info', 'success', 'warning', 'error'
      duration: notification.duration || 5000, // Auto-dismiss after 5 seconds by default
      dismissible: notification.dismissible !== false, // Dismissible by default
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-dismiss notification after duration (if duration > 0)
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  }, []);

  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Shorthand methods for common notification types
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      title: options.title || 'Success',
      message,
      type: 'success',
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      title: options.title || 'Error',
      message,
      type: 'error',
      duration: options.duration || 7000, // Errors last longer by default
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      title: options.title || 'Information',
      message,
      type: 'info',
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      title: options.title || 'Warning',
      message,
      type: 'warning',
      ...options
    });
  }, [addNotification]);

  // Update a notification by ID
  const updateNotification = useCallback((id, updatedData) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, ...updatedData } 
          : notification
      )
    );
  }, []);

  // Notification component to display notifications
  const NotificationContainer = () => {
    if (notifications.length === 0) return null;

    return (
      <div className="fixed right-0 top-0 z-50 flex max-h-screen w-full flex-col items-end p-4 sm:max-w-sm">
        <div className="flex w-full flex-col space-y-2">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={() => removeNotification(notification.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  const NotificationItem = ({ notification, onDismiss }) => {
    const {
      id,
      title,
      message,
      type = 'info',
      dismissible = true
    } = notification;

    // Type-based styles
    const typeStyles = {
      info: 'bg-blue-50 border-blue-400 text-blue-800',
      success: 'bg-green-50 border-green-400 text-green-800',
      warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
      error: 'bg-red-50 border-red-400 text-red-800'
    };

    const iconStyles = {
      info: 'text-blue-400',
      success: 'text-green-400',
      warning: 'text-yellow-400',
      error: 'text-red-400'
    };

    // Icons based on type
    const icons = {
      info: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      success: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    };

    return (
      <div
        className={`w-full rounded-lg border-l-4 p-4 shadow-md ${typeStyles[type]}`}
        role="alert"
      >
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${iconStyles[type]}`}>
            {icons[type]}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{title}</p>
              {dismissible && (
                <button
                  type="button"
                  className={`-mr-1 -mt-1 ml-auto inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    type === 'info' ? 'focus:ring-blue-500 hover:bg-blue-100' :
                    type === 'success' ? 'focus:ring-green-500 hover:bg-green-100' :
                    type === 'warning' ? 'focus:ring-yellow-500 hover:bg-yellow-100' :
                    'focus:ring-red-500 hover:bg-red-100'
                  }`}
                  onClick={onDismiss}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
            {message && (
              <div className="mt-1 text-sm">
                {typeof message === 'string' ? <p>{message}</p> : message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Context value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    updateNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

export default NotificationContext;