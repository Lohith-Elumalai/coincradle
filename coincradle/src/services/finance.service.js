// src/services/finance.service.js
import financeApi from '../api/finance';
import transactionsApi from '../api/transactions';
import bankApi from '../api/bankApi';
import budgetApi from '../api/budgetApi';
import { formatCurrency } from '../utils/formattters.js';
import { formatDate } from '../utils/formattters.js';
import { calculateGrowth } from '../utils/calculations.js';
import { calculateAverages } from '../utils/calculations.js';

class FinanceService {
  // Financial overview methods
  async getFinancialSummary() {
    try {
      const response = await financeApi.getFinancialSummary();
      return {
        ...response,
        netWorth: formatCurrency(response.assets - response.liabilities),
        savingsRate: `${((response.monthlyIncome - response.monthlyExpenses) / response.monthlyIncome * 100).toFixed(1)}%`,
        monthlyIncome: formatCurrency(response.monthlyIncome),
        monthlyExpenses: formatCurrency(response.monthlyExpenses)
      };
    } catch (error) {
      console.error('Failed to fetch financial summary', error);
      throw error;
    }
  }

  // Transaction methods
  async getTransactions(filters = {}) {
    try {
      const transactions = await transactionsApi.getTransactions(filters);
      return transactions.map(transaction => ({
        ...transaction,
        amount: formatCurrency(transaction.amount),
        date: formatDate(transaction.date),
        formattedCategory: transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)
      }));
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      throw error;
    }
  }

  async addTransaction(transaction) {
    try {
      return await transactionsApi.addTransaction(transaction);
    } catch (error) {
      console.error('Failed to add transaction', error);
      throw error;
    }
  }

  async updateTransaction(id, transaction) {
    try {
      return await transactionsApi.updateTransaction(id, transaction);
    } catch (error) {
      console.error('Failed to update transaction', error);
      throw error;
    }
  }

  async deleteTransaction(id) {
    try {
      return await transactionsApi.deleteTransaction(id);
    } catch (error) {
      console.error('Failed to delete transaction', error);
      throw error;
    }
  }

  async categorizeTransactions() {
    try {
      return await transactionsApi.categorizeTransactions();
    } catch (error) {
      console.error('Failed to categorize transactions', error);
      throw error;
    }
  }

  // Budget methods
  async getBudget() {
    try {
      const budget = await budgetApi.getBudget();
      
      // Add progress calculations and formatting
      return {
        ...budget,
        categories: budget.categories.map(category => {
          const progress = (category.spent / category.limit) * 100;
          return {
            ...category,
            spent: formatCurrency(category.spent),
            limit: formatCurrency(category.limit),
            progress: Math.min(progress, 100), // Cap at 100%
            status: progress > 100 ? 'exceeded' : progress > 80 ? 'warning' : 'good'
          };
        }),
        totalBudget: formatCurrency(budget.totalBudget),
        totalSpent: formatCurrency(budget.totalSpent),
        remaining: formatCurrency(budget.totalBudget - budget.totalSpent)
      };
    } catch (error) {
      console.error('Failed to fetch budget', error);
      throw error;
    }
  }

  async updateBudget(budgetData) {
    try {
      return await budgetApi.updateBudget(budgetData);
    } catch (error) {
      console.error('Failed to update budget', error);
      throw error;
    }
  }

  async getBudgetRecommendations() {
    try {
      return await budgetApi.getBudgetRecommendations();
    } catch (error) {
      console.error('Failed to fetch budget recommendations', error);
      throw error;
    }
  }

  // Bank account methods
  async getBankAccounts() {
    try {
      const accounts = await bankApi.getAccounts();
      return accounts.map(account => ({
        ...account,
        balance: formatCurrency(account.balance),
        formattedType: account.type.charAt(0).toUpperCase() + account.type.slice(1)
      }));
    } catch (error) {
      console.error('Failed to fetch bank accounts', error);
      throw error;
    }
  }

  async connectBankAccount(credentials) {
    try {
      return await bankApi.connect(credentials);
    } catch (error) {
      console.error('Failed to connect bank account', error);
      throw error;
    }
  }

  async disconnectBankAccount(accountId) {
    try {
      return await bankApi.disconnect(accountId);
    } catch (error) {
      console.error('Failed to disconnect bank account', error);
      throw error;
    }
  }

  async refreshBankData() {
    try {
      return await bankApi.refreshData();
    } catch (error) {
      console.error('Failed to refresh bank data', error);
      throw error;
    }
  }

  // Financial insights methods
  async getSpendingInsights(timeframe = 'month') {
    try {
      const data = await financeApi.getSpendingInsights(timeframe);
      
      // Add calculated fields
      return {
        ...data,
        topCategories: data.categories.slice(0, 5),
        categoryGrowth: calculateGrowth(data.historicalData),
        averages: calculateAverages(data.historicalData)
      };
    } catch (error) {
      console.error('Failed to fetch spending insights', error);
      throw error;
    }
  }

  async getIncomeInsights(timeframe = 'month') {
    try {
      const data = await financeApi.getIncomeInsights(timeframe);
      
      // Add calculated fields
      return {
        ...data,
        incomeGrowth: calculateGrowth(data.historicalData),
        averages: calculateAverages(data.historicalData)
      };
    } catch (error) {
      console.error('Failed to fetch income insights', error);
      throw error;
    }
  }
}

export default new FinanceService();