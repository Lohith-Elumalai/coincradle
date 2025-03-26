// src/services/notification.service.js
import analyticsService from './analytics.service';

class NotificationService {
  constructor() {
    this.listeners = [];
    this.queue = [];
    this.notificationId = 0;
    this.notificationTypes = {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning',
      INFO: 'info'
    };
  }

  // Core notification methods
  notify(message, type = 'info', options = {}) {
    const notification = {
      id: ++this.notificationId,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      duration: options.duration || this.getDurationByType(type),
      dismissible: options.dismissible !== false, // Default to true
      action: options.action || null,
      category: options.category || 'general',
      ...options
    };

    this.queue.push(notification);
    this.notifyListeners();

    // Track for analytics
    analyticsService.trackEvent('NOTIFICATION_DISPLAYED', {
      type,
      category: notification.category,
      message: message.substring(0, 50) // Truncate for privacy
    });

    return notification.id;
  }

  // Convenience methods for different notification types
  success(message, options = {}) {
    return this.notify(message, this.notificationTypes.SUCCESS, options);
  }

  error(message, options = {}) {
    return this.notify(message, this.notificationTypes.ERROR, options);
  }

  warning(message, options = {}) {
    return this.notify(message, this.notificationTypes.WARNING, options);
  }

  info(message, options = {}) {
    return this.notify(message, this.notificationTypes.INFO, options);
  }

  // Notification management
  dismiss(id) {
    const index = this.queue.findIndex(notification => notification.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  dismissAll() {
    this.queue = [];
    this.notifyListeners();
  }

  markAsRead(id) {
    const notification = this.queue.find(notification => notification.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  markAllAsRead() {
    this.queue.forEach(notification => {
      notification.read = true;
    });
    this.notifyListeners();
  }

  getAll(options = {}) {
    let filteredQueue = [...this.queue];
    
    // Apply filters
    if (options.type) {
      filteredQueue = filteredQueue.filter(notification => notification.type === options.type);
    }
    
    if (options.category) {
      filteredQueue = filteredQueue.filter(notification => notification.category === options.category);
    }
    
    if (options.read !== undefined) {
      filteredQueue = filteredQueue.filter(notification => notification.read === options.read);
    }
    
    // Apply sorting
    if (options.sort === 'oldest') {
      filteredQueue.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else {
      // Default sort by newest first
      filteredQueue.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    // Apply limit
    if (options.limit) {
      filteredQueue = filteredQueue.slice(0, options.limit);
    }
    
    return filteredQueue;
  }

  getUnreadCount() {
    return this.queue.filter(notification => !notification.read).length;
  }

  // Financial-specific notifications
  notifyBudgetAlert(category, percentUsed, limit) {
    return this.warning(
      `You've used ${percentUsed}% of your ${category} budget.`,
      {
        category: 'budget',
        data: { categoryName: category, percentUsed, limit },
        action: { label: 'View Budget', path: '/budget' }
      }
    );
  }

  notifyLargeTransaction(transaction) {
    return this.info(
      `Large transaction detected: ${transaction.description} for ${transaction.amount}`,
      {
        category: 'transaction',
        data: { transaction },
        action: { label: 'View Details', path: `/transactions/${transaction.id}` }
      }
    );
  }

  notifyGoalProgress(goalName, progress) {
    return this.success(
      `You're making great progress on your "${goalName}" goal! (${progress}% complete)`,
      {
        category: 'goals',
        data: { goalName, progress },
        action: { label: 'View Goals', path: '/planning' }
      }
    );
  }

  notifyBillDue(bill) {
    const daysUntilDue = Math.ceil((new Date(bill.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    return this.info(
      `${bill.name} payment of ${bill.amount} is due in ${daysUntilDue} days`,
      {
        category: 'bills',
        data: { bill, daysUntilDue },
        action: { label: 'Pay Now', path: `/bills/pay/${bill.id}` }
      }
    );
  }

  // Observer pattern implementation
  subscribe(callback) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.queue));
  }

  // Helper methods
  getDurationByType(type) {
    switch (type) {
      case this.notificationTypes.ERROR:
        return 0; // Don't auto-dismiss errors
      case this.notificationTypes.WARNING:
        return 10000; // 10 seconds
      case this.notificationTypes.SUCCESS:
        return 5000; // 5 seconds
      case this.notificationTypes.INFO:
      default:
        return 7000; // 7 seconds
    }
  }
}

export default new NotificationService();