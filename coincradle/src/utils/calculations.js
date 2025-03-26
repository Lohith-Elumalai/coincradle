/**
 * Utility functions for financial calculations in the finance-ai app
 */

/**
 * Calculates the sum of an array of numbers
 * @param {number[]} values - Array of numbers
 * @returns {number} Sum of the values
 */
export const sum = (values) => {
    return values.reduce((total, value) => total + (Number(value) || 0), 0);
  };
  
  /**
   * Calculates the average of an array of numbers
   * @param {number[]} values - Array of numbers
   * @returns {number} Average of the values, or 0 if empty array
   */
  export const average = (values) => {
    if (!values.length) return 0;
    return sum(values) / values.length;
  };
  
  /**
   * Calculates the percentage change between two numbers
   * @param {number} oldValue - Initial value
   * @param {number} newValue - Current value
   * @returns {number} Percentage change
   */
  export const percentageChange = (oldValue, newValue) => {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  };
  
  /**
   * Calculates the compound interest over time
   * @param {number} principal - Initial investment amount
   * @param {number} rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
   * @param {number} time - Time in years
   * @param {number} compounds - Number of times compounded per year (default: 1)
   * @returns {number} Final amount after compound interest
   */
  export const compoundInterest = (principal, rate, time, compounds = 1) => {
    return principal * Math.pow(1 + rate / compounds, compounds * time);
  };
  
  /**
   * Calculates monthly payment for a loan
   * @param {number} principal - Loan amount
   * @param {number} annualRate - Annual interest rate (as decimal)
   * @param {number} termYears - Loan term in years
   * @returns {number} Monthly payment amount
   */
  export const calculateLoanPayment = (principal, annualRate, termYears) => {
    const monthlyRate = annualRate / 12;
    const numPayments = termYears * 12;
    
    if (annualRate === 0) {
      return principal / numPayments;
    }
    
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    );
  };
  
  /**
   * Generates an amortization schedule for a loan
   * @param {number} principal - Loan amount
   * @param {number} annualRate - Annual interest rate (as decimal)
   * @param {number} termYears - Loan term in years
   * @returns {Array} Amortization schedule as array of monthly payment objects
   */
  export const generateAmortizationSchedule = (principal, annualRate, termYears) => {
    const monthlyRate = annualRate / 12;
    const numPayments = termYears * 12;
    const monthlyPayment = calculateLoanPayment(principal, annualRate, termYears);
    
    let balance = principal;
    const schedule = [];
    
    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        month,
        payment: monthlyPayment,
        principalPayment,
        interestPayment,
        remainingBalance: Math.max(0, balance)
      });
    }
    
    return schedule;
  };
  
  /**
   * Calculates the return on investment (ROI)
   * @param {number} initialInvestment - Initial investment amount
   * @param {number} finalValue - Final value of the investment
   * @returns {number} ROI as a percentage
   */
  export const calculateROI = (initialInvestment, finalValue) => {
    return ((finalValue - initialInvestment) / initialInvestment) * 100;
  };
  
  /**
   * Calculates net worth from assets and liabilities
   * @param {number[]} assets - Array of asset values
   * @param {number[]} liabilities - Array of liability values
   * @returns {number} Net worth
   */
  export const calculateNetWorth = (assets, liabilities) => {
    const totalAssets = sum(assets);
    const totalLiabilities = sum(liabilities);
    return totalAssets - totalLiabilities;
  };
  
  /**
   * Calculates debt-to-income ratio
   * @param {number} monthlyDebtPayments - Total monthly debt payments
   * @param {number} grossMonthlyIncome - Gross monthly income
   * @returns {number} Debt-to-income ratio as a percentage
   */
  export const calculateDebtToIncomeRatio = (monthlyDebtPayments, grossMonthlyIncome) => {
    if (grossMonthlyIncome === 0) return 0;
    return (monthlyDebtPayments / grossMonthlyIncome) * 100;
  };
  
  /**
   * Calculates future value with recurring contributions
   * @param {number} principal - Initial amount
   * @param {number} monthlyContribution - Monthly contribution amount
   * @param {number} annualRate - Annual interest rate (as decimal)
   * @param {number} years - Investment period in years
   * @returns {number} Future value
   */
  export const calculateFutureValueWithContributions = (
    principal,
    monthlyContribution,
    annualRate,
    years
  ) => {
    const monthlyRate = annualRate / 12;
    const numMonths = years * 12;
    
    // Future value of initial principal
    const principalFV = principal * Math.pow(1 + monthlyRate, numMonths);
    
    // Future value of recurring contributions
    let contributionsFV = 0;
    if (monthlyRate > 0) {
      contributionsFV = monthlyContribution * (Math.pow(1 + monthlyRate, numMonths) - 1) / monthlyRate;
    } else {
      contributionsFV = monthlyContribution * numMonths;
    }
    
    return principalFV + contributionsFV;
  };
  
  /**
   * Calculates the inflation-adjusted value
   * @param {number} presentValue - Present value
   * @param {number} inflationRate - Annual inflation rate (as decimal)
   * @param {number} years - Number of years
   * @returns {number} Future value adjusted for inflation
   */
  export const calculateInflationAdjustedValue = (presentValue, inflationRate, years) => {
    return presentValue / Math.pow(1 + inflationRate, years);
  };
  
  /**
   * Calculates simple moving average for a time series
   * @param {number[]} data - Array of numeric values
   * @param {number} windowSize - Size of the moving window
   * @returns {number[]} Array of moving averages
   */
  export const calculateMovingAverage = (data, windowSize) => {
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < windowSize - 1) {
        // Not enough data points yet
        result.push(null);
      } else {
        // Calculate average of the window
        const windowData = data.slice(i - windowSize + 1, i + 1);
        result.push(average(windowData));
      }
    }
    
    return result;
  };
  
  /**
   * Calculates the weighted average of values
   * @param {number[]} values - Array of values
   * @param {number[]} weights - Array of weights
   * @returns {number} Weighted average
   */
  export const weightedAverage = (values, weights) => {
    if (values.length !== weights.length) {
      throw new Error('Values and weights arrays must have the same length');
    }
    
    let sumProduct = 0;
    let sumWeights = 0;
    
    for (let i = 0; i < values.length; i++) {
      sumProduct += values[i] * weights[i];
      sumWeights += weights[i];
    }
    
    return sumWeights === 0 ? 0 : sumProduct / sumWeights;
  };
  
  /**
   * Calculates the present value of a future amount
   * @param {number} futureValue - Future value
   * @param {number} rate - Discount rate (as decimal)
   * @param {number} periods - Number of periods
   * @returns {number} Present value
   */
  export const calculatePresentValue = (futureValue, rate, periods) => {
    return futureValue / Math.pow(1 + rate, periods);
  };
  
  /**
   * Calculates the internal rate of return (IRR)
   * @param {number[]} cashflows - Array of cashflows (negative for outflows, positive for inflows)
   * @param {number} guess - Initial guess for IRR (default: 0.1)
   * @param {number} tolerance - Error tolerance (default: 0.0001)
   * @param {number} maxIterations - Maximum iterations (default: 1000)
   * @returns {number} Internal rate of return as decimal
   */
  export const calculateIRR = (cashflows, guess = 0.1, tolerance = 0.0001, maxIterations = 1000) => {
    let irr = guess;
    
    // Newton-Raphson method
    for (let i = 0; i < maxIterations; i++) {
      let f = 0;    // NPV
      let df = 0;   // Derivative of NPV
      
      for (let j = 0; j < cashflows.length; j++) {
        f += cashflows[j] / Math.pow(1 + irr, j);
        df -= j * cashflows[j] / Math.pow(1 + irr, j + 1);
      }
      
      // Calculate new guess using Newton-Raphson formula
      const newIrr = irr - f / df;
      
      // Check if the solution has converged
      if (Math.abs(newIrr - irr) < tolerance) {
        return newIrr;
      }
      
      irr = newIrr;
    }
    
    // Failed to converge
    throw new Error('IRR calculation failed to converge');
  };
  
  export default {
    sum,
    average,
    percentageChange,
    compoundInterest,
    calculateLoanPayment,
    generateAmortizationSchedule,
    calculateROI,
    calculateNetWorth,
    calculateDebtToIncomeRatio,
    calculateFutureValueWithContributions,
    calculateInflationAdjustedValue,
    calculateMovingAverage,
    weightedAverage,
    calculatePresentValue,
    calculateIRR
  };