// src/hooks/useFinanceData.js
import { useContext } from 'react';
import FinanceDataContext from '../contexts/FinanceDataContext';

/**
 * Custom hook to access and use financial data context functionality
 * 
 * @returns {Object} Financial data context values and methods
 */
const useFinanceData = () => {
  const context = useContext(FinanceDataContext);
  
  if (!context) {
    throw new Error('useFinanceData must be used within a FinanceDataProvider');
  }
  
  return context;
};

export default useFinanceData;