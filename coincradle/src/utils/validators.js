/**
 * Utility functions for validating various inputs in the finance-ai app
 */

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  
  /**
   * Validates a password based on common security rules
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with isValid flag and message
   */
  export const validatePassword = (password) => {
    // Password must be at least 8 characters long
    if (!password || password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long'
      };
    }
    
    // Password must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter'
      };
    }
    
    // Password must contain at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter'
      };
    }
    
    // Password must contain at least one number
    if (!/\d/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one number'
      };
    }
    
    // Password must contain at least one special character
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one special character'
      };
    }
    
    return {
      isValid: true,
      message: 'Password is valid'
    };
  };
  
  /**
   * Validates a credit card number using Luhn algorithm
   * @param {string} cardNumber - Credit card number to validate
   * @returns {boolean} Whether card number is valid
   */
  export const isValidCreditCard = (cardNumber) => {
    // Remove all non-digit characters
    const cleaned = cardNumber.replace(/\D/g, '');
    
    // Must have between 13-19 digits (standard card length range)
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }
    
    // Luhn algorithm validation
    let sum = 0;
    let doubleUp = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
      if (doubleUp) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      doubleUp = !doubleUp;
    }
    
    return sum % 10 === 0;
  };
  
  /**
   * Validates a phone number
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} Whether phone number is valid
   */
  export const isValidPhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid length (10 digits for US, optionally 11 with country code 1)
    return (cleaned.length === 10) || (cleaned.length === 11 && cleaned.charAt(0) === '1');
  };
  
  /**
   * Validates a date format
   * @param {string} date - Date string to validate
   * @param {string} format - Expected format (default: 'YYYY-MM-DD')
   * @returns {boolean} Whether date format is valid
   */
  export const isValidDateFormat = (date, format = 'YYYY-MM-DD') => {
    if (!date) return false;
    
    let regex;
    
    switch (format) {
      case 'YYYY-MM-DD':
        regex = /^\d{4}-\d{2}-\d{2}$/;
        break;
      case 'MM/DD/YYYY':
        regex = /^\d{2}\/\d{2}\/\d{4}$/;
        break;
      case 'DD/MM/YYYY':
        regex = /^\d{2}\/\d{2}\/\d{4}$/;
        break;
      default:
        return false;
    }
    
    if (!regex.test(date)) return false;
    
    // Additional validation to ensure the date exists
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };
  
  /**
   * Validates a proper name (first name, last name)
   * @param {string} name - Name to validate
   * @returns {boolean} Whether name is valid
   */
  export const isValidName = (name) => {
    // At least 2 characters, only letters, spaces, hyphens, and apostrophes
    const regex = /^[a-zA-Z\s'-]{2,}$/;
    return regex.test(name);
  };
  
  /**
   * Validates a currency amount
   * @param {string|number} amount - Amount to validate
   * @returns {boolean} Whether amount is valid
   */
  export const isValidCurrencyAmount = (amount) => {
    // Convert to string and remove currency symbols and commas
    const cleaned = String(amount).replace(/[$,]/g, '');
    
    // Match a valid decimal number with up to 2 decimal places
    const regex = /^-?\d+(\.\d{1,2})?$/;
    return regex.test(cleaned);
  };
  
  /**
   * Validates a US zip code
   * @param {string} zipCode - Zip code to validate
   * @returns {boolean} Whether zip code is valid
   */
  export const isValidZipCode = (zipCode) => {
    // 5-digit or 5+4 digit format
    const regex = /^\d{5}(-\d{4})?$/;
    return regex.test(zipCode);
  };
  
  /**
   * Validates a URL
   * @param {string} url - URL to validate
   * @returns {boolean} Whether URL is valid
   */
  export const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Checks if a value is empty (null, undefined, empty string, or empty array/object)
   * @param {*} value - Value to check
   * @returns {boolean} Whether value is empty
   */
  export const isEmpty = (value) => {
    if (value === null || value === undefined) {
      return true;
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      return true;
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    
    return false;
  };
  
  export default {
    isValidEmail,
    validatePassword,
    isValidCreditCard,
    isValidPhoneNumber,
    isValidDateFormat,
    isValidName,
    isValidCurrencyAmount,
    isValidZipCode,
    isValidUrl,
    isEmpty
  };