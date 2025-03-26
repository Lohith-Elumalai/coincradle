// src/hooks/useInvestments.js
import { useState, useCallback, useMemo } from 'react';
import useFinanceData from './useFinanceData';
import useNotification from './useNotification';
import { aiService } from '../services/ai.service';

/**
 * Custom hook to manage investment-related operations
 * 
 * @returns {Object} Investment-related state and methods
 */
const useInvestments = () => {
  const { 
    investments, 
    fetchInvestments,
    addInvestment,
    updateInvestment,
    loading 
  } = useFinanceData();
  
  const { showSuccess, showError } = useNotification();
  
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [riskProfile, setRiskProfile] = useState('moderate'); // 'conservative', 'moderate', 'aggressive'
  
  // Calculate portfolio totals
  const portfolioTotals = useMemo(() => {
    if (!investments || investments.length === 0) {
      return {
        totalValue: 0,
        totalCost: 0,
        totalGain: 0,
        totalGainPercentage: 0
      };
    }
    
    const totalValue = investments.reduce((sum, investment) => sum + investment.currentValue, 0);
    const totalCost = investments.reduce((sum, investment) => sum + investment.purchaseValue, 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercentage = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
    
    return {
      totalValue,
      totalCost,
      totalGain,
      totalGainPercentage
    };
  }, [investments]);
  
  // Get allocation data for charts
  const getAllocationData = useCallback((groupBy = 'assetClass') => {
    if (!investments || investments.length === 0) {
      return [];
    }
    
    const groups = {};
    const totalValue = portfolioTotals.totalValue;
    
    investments.forEach(investment => {
      const key = investment[groupBy] || 'Other';
      
      if (!groups[key]) {
        groups[key] = 0;
      }
      
      groups[key] += investment.currentValue;
    });
    
    return Object.entries(groups).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalValue) * 100).toFixed(1)
    }));
  }, [investments, portfolioTotals.totalValue]);
  
  // Get top performers
  const getTopPerformers = useMemo(() => {
    if (!investments || investments.length === 0) {
      return [];
    }
    
    // Calculate return percentage for each investment
    const withReturns = investments.map(investment => {
      const gainAmount = investment.currentValue - investment.purchaseValue;
      const gainPercentage = investment.purchaseValue > 0 
        ? (gainAmount / investment.purchaseValue) * 100 
        : 0;
        
      return {
        ...investment,
        gainAmount,
        gainPercentage
      };
    });
    
    // Sort by gain percentage and take top 5
    return [...withReturns]
      .sort((a, b) => b.gainPercentage - a.gainPercentage)
      .slice(0, 5);
  }, [investments]);
  
  // Get worst performers
  const getWorstPerformers = useMemo(() => {
    if (!investments || investments.length === 0) {
      return [];
    }
    
    // Calculate return percentage for each investment
    const withReturns = investments.map(investment => {
      const gainAmount = investment.currentValue - investment.purchaseValue;
      const gainPercentage = investment.purchaseValue > 0 
        ? (gainAmount / investment.purchaseValue) * 100 
        : 0;
        
      return {
        ...investment,
        gainAmount,
        gainPercentage
      };
    });
    
    // Sort by gain percentage (ascending) and take bottom 5
    return [...withReturns]
      .sort((a, b) => a.gainPercentage - b.gainPercentage)
      .slice(0, 5);
  }, [investments]);
  
  // Add a new investment
  const createInvestment = useCallback(async (investmentData) => {
    try {
      const newInvestment = await addInvestment(investmentData);
      showSuccess('Investment added successfully');
      return newInvestment;
    } catch (err) {
      showError('Failed to add investment: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }, [addInvestment, showSuccess, showError]);
  
  // Update an investment
  const editInvestment = useCallback(async (investmentId, investmentData) => {
    try {
      const updatedInvestment = await updateInvestment(investmentId, investmentData);
      showSuccess('Investment updated successfully');
      
      // Update selected investment if it's the one being edited
      if (selectedInvestment && selectedInvestment.id === investmentId) {
        setSelectedInvestment(updatedInvestment);
      }
      
      return updatedInvestment;
    } catch (err) {
      showError('Failed to update investment: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }, [updateInvestment, showSuccess, showError, selectedInvestment]);
  
  // Load AI recommendations
  const loadRecommendations = useCallback(async () => {
    if (!investments || investments.length === 0) {
      return;
    }
    
    setLoadingRecommendations(true);
    
    try {
      const data = await aiService.getInvestmentRecommendations({
        portfolio: investments,
        riskProfile
      });
      
      setRecommendations(data);
    } catch (err) {
      showError('Failed to load investment recommendations: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingRecommendations(false);
    }
  }, [investments, riskProfile, showError]);
  
  // Refresh investments data
  const refreshInvestments = useCallback(async () => {
    try {
      await fetchInvestments();
    } catch (err) {
      showError('Failed to refresh investments: ' + (err.message || 'Unknown error'));
    }
  }, [fetchInvestments, showError]);
  
  return {
    investments,
    selectedInvestment,
    setSelectedInvestment,
    loading: loading.investments,
    portfolioTotals,
    getAllocationData,
    topPerformers: getTopPerformers,
    worstPerformers: getWorstPerformers,
    recommendations,
    loadingRecommendations,
    riskProfile,
    setRiskProfile,
    createInvestment,
    editInvestment,
    loadRecommendations,
    refreshInvestments
  };
};

export default useInvestments;