// src/services/analytics.service.js
import { storage } from '../utils/storage';
import { ANALYTICS_EVENTS } from '../utils/constants';

class AnalyticsService {
  constructor() {
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.queue = [];
    this.isProcessing = false;
    this.initialized = false;
    
    // Queue processor
    setInterval(() => this.processQueue(), 10000);
  }

  init(userId, options = {}) {
    this.userId = userId;
    this.options = {
      endpoint: process.env.REACT_APP_ANALYTICS_ENDPOINT || '/api/analytics',
      batchSize: 10,
      ...options
    };
    
    this.initialized = true;
    return this;
  }

  // Track user actions
  trackEvent(eventName, properties = {}) {
    if (!this.initialized) {
      console.warn('Analytics not initialized');
      return false;
    }

    if (!ANALYTICS_EVENTS[eventName]) {
      console.warn(`Unknown event type: ${eventName}`);
    }

    const event = {
      eventName,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      properties
    };

    this.queue.push(event);
    
    // Process immediately if small queue
    if (this.queue.length <= 3) {
      this.processQueue();
    }
    
    return true;
  }

  // Track page views
  trackPageView(page, referrer = '') {
    return this.trackEvent('PAGE_VIEW', { page, referrer });
  }

  // Track feature usage
  trackFeatureUsage(featureName, result = 'success') {
    return this.trackEvent('FEATURE_USAGE', { featureName, result });
  }

  // Track errors
  trackError(errorType, errorMessage, stackTrace = '') {
    return this.trackEvent('ERROR', {
      errorType,
      errorMessage,
      stackTrace
    });
  }

  // Track performance metrics
  trackPerformance(metricName, durationMs) {
    return this.trackEvent('PERFORMANCE', {
      metricName,
      durationMs
    });
  }

  // Financial-specific analytics
  trackFinancialAction(actionType, details) {
    return this.trackEvent('FINANCIAL_ACTION', {
      actionType,
      details
    });
  }

  trackBudgetUpdate(newBudget, previousBudget) {
    return this.trackEvent('BUDGET_UPDATE', {
      newTotal: newBudget.totalBudget,
      previousTotal: previousBudget.totalBudget,
      categoryChanges: this.getDifferences(newBudget.categories, previousBudget.categories)
    });
  }

  trackConnectedAccount(accountType, bank) {
    return this.trackEvent('ACCOUNT_CONNECTED', {
      accountType,
      bank
    });
  }

  // User engagement metrics
  trackEngagementMetrics(metrics) {
    return this.trackEvent('ENGAGEMENT', metrics);
  }

  // AI interaction tracking
  trackAIInteraction(promptType, responseQuality, assistanceType) {
    return this.trackEvent('AI_INTERACTION', {
      promptType,
      responseQuality,
      assistanceType
    });
  }

  // Internal methods
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0 || !this.initialized) {
      return;
    }

    this.isProcessing = true;

    try {
      // Get batch of events
      const batch = this.queue.slice(0, this.options.batchSize);
      
      // Send events to analytics endpoint
      const response = await fetch(this.options.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ events: batch })
      });

      if (response.ok) {
        // Remove sent events from queue
        this.queue = this.queue.slice(batch.length);
      } else {
        console.error('Failed to send analytics data', await response.text());
      }
    } catch (error) {
      console.error('Analytics processing error', error);
    } finally {
      this.isProcessing = false;
    }
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2, 15);
  }

  getDifferences(newArray, oldArray) {
    const differences = [];
    
    // Simple comparison - in real app would need more sophisticated diffing
    newArray.forEach(newItem => {
      const oldItem = oldArray.find(item => item.id === newItem.id);
      if (oldItem && oldItem.limit !== newItem.limit) {
        differences.push({
          id: newItem.id,
          category: newItem.name,
          oldLimit: oldItem.limit,
          newLimit: newItem.limit,
          percentChange: ((newItem.limit - oldItem.limit) / oldItem.limit * 100).toFixed(1)
        });
      }
    });
    
    return differences;
  }
}

export default new AnalyticsService();