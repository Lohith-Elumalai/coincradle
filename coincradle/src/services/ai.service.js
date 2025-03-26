// src/services/ai.service.js
import aiApi from '../api/aiModel';
import financeService from './finance.service';
import { storage } from '../utils/storage';

const CHAT_HISTORY_KEY = 'finance_ai_chat_history';

class AIService {
  constructor() {
    this.chatHistory = this.loadChatHistory();
  }

  // Chat functionality
  async sendMessage(message) {
    try {
      // Get financial context data to enhance AI responses
      const context = await this.getFinancialContext();
      
      // Send message with context to AI
      const response = await aiApi.chat({
        message,
        context,
        history: this.chatHistory
      });

      // Update chat history
      this.updateChatHistory({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });
      
      this.updateChatHistory({
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        suggestions: response.suggestions || []
      });
      
      return response;
    } catch (error) {
      console.error('AI chat failed', error);
      throw error;
    }
  }

  async getFinancialInsights() {
    try {
      // Get financial data to analyze
      const transactions = await financeService.getTransactions();
      const budget = await financeService.getBudget();
      const summary = await financeService.getFinancialSummary();
      
      // Generate insights based on financial data
      const insights = await aiApi.generateInsights({
        transactions,
        budget,
        summary
      });
      
      return insights;
    } catch (error) {
      console.error('Failed to get AI insights', error);
      throw error;
    }
  }

  async getBudgetRecommendations() {
    try {
      // Get spending patterns to analyze
      const transactions = await financeService.getTransactions({ 
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() 
      });
      
      // Generate budget recommendations
      const recommendations = await aiApi.generateBudgetRecommendations({
        transactions,
        currentIncome: (await financeService.getFinancialSummary()).monthlyIncome
      });
      
      return recommendations;
    } catch (error) {
      console.error('Failed to get budget recommendations', error);
      throw error;
    }
  }

  async getDebtPaymentPlan() {
    try {
      // Get financial context for debt analysis
      const context = await this.getFinancialContext();
      
      // Generate debt payment plan
      const plan = await aiApi.generateDebtPaymentPlan(context);
      
      return plan;
    } catch (error) {
      console.error('Failed to get debt payment plan', error);
      throw error;
    }
  }

  async getInvestmentRecommendations(riskTolerance, timeHorizon) {
    try {
      const recommendations = await aiApi.generateInvestmentRecommendations({
        riskTolerance, 
        timeHorizon,
        financialSummary: await financeService.getFinancialSummary()
      });
      
      return recommendations;
    } catch (error) {
      console.error('Failed to get investment recommendations', error);
      throw error;
    }
  }

  // Internal methods
  async getFinancialContext() {
    try {
      // Gather financial data to provide context for AI
      return {
        summary: await financeService.getFinancialSummary(),
        recentTransactions: await financeService.getTransactions({ 
          limit: 20, 
          sort: 'date:desc' 
        }),
        budget: await financeService.getBudget(),
        spendingInsights: await financeService.getSpendingInsights('month')
      };
    } catch (error) {
      console.error('Failed to get financial context', error);
      return {}; // Return empty context if data fetch fails
    }
  }

  updateChatHistory(message) {
    this.chatHistory.push(message);
    
    // Limit history size (keep last 50 messages)
    if (this.chatHistory.length > 50) {
      this.chatHistory = this.chatHistory.slice(this.chatHistory.length - 50);
    }
    
    // Save to storage
    this.saveChatHistory();
    
    return this.chatHistory;
  }

  clearChatHistory() {
    this.chatHistory = [];
    storage.remove(CHAT_HISTORY_KEY);
    return this.chatHistory;
  }

  getChatHistory() {
    return this.chatHistory;
  }

  loadChatHistory() {
    const history = storage.get(CHAT_HISTORY_KEY);
    return history || [];
  }

  saveChatHistory() {
    storage.set(CHAT_HISTORY_KEY, this.chatHistory);
  }
}

export default new AIService();