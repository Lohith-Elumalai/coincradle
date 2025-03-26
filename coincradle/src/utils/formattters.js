/**
 * Utility functions for formatting various data types in the finance-ai app
 */

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a number as a percentage
 * @param {number} value - The value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formats a date object to string
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type ('short', 'medium', 'long', or 'relative')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = "medium", locale = "en-US") => {
  const dateObj = new Date(date);

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString(locale, {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      });
    case "medium":
      return dateObj.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    case "long":
      return dateObj.toLocaleDateString(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    case "relative":
      return formatRelativeDate(dateObj);
    default:
      return dateObj.toLocaleDateString(locale);
  }
};

/**
 * Formats a date as a relative time string (e.g., "2 days ago")
 * @param {Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeDate = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSecs < 60) {
    return "just now";
  } else if (diffInMins < 60) {
    return `${diffInMins} ${diffInMins === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  } else {
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  }
};

/**
 * Truncates a string if it's longer than the specified maximum length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum allowed length
 * @param {string} suffix - Suffix to add to truncated string (default: '...')
 * @returns {string} Truncated string
 */
export const truncateString = (str, maxLength, suffix = "...") => {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}${suffix}`;
};

/**
 * Formats a transaction description to be more readable
 * @param {string} description - Raw transaction description
 * @returns {string} Formatted description
 */
export const formatTransactionDescription = (description) => {
  // Remove common prefixes and suffixes added by payment processors
  let formatted = description
    .replace(
      /^(POS |ACH |DEBIT |CREDIT |PMNT |PMT |PURCHASE |PYMT |WDL |DEP )/,
      ""
    )
    .replace(/( PURCHASE| PAYMENT| DEPOSIT| TRANSFER| WITHDRAWAL)$/, "");

  // Capitalize first letter of each word
  formatted = formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formatted;
};

/**
 * Formats a large number with k, M, B suffix
 * @param {number} num - Number to format
 * @param {number} digits - Number of decimal places (default: 1)
 * @returns {string} Formatted number
 */
export const formatLargeNumber = (num, digits = 1) => {
  const units = ["", "k", "M", "B", "T"];
  let unitIndex = 0;
  let scaledNum = num;

  while (scaledNum >= 1000 && unitIndex < units.length - 1) {
    unitIndex += 1;
    scaledNum /= 1000;
  }

  return `${scaledNum.toFixed(digits)}${units[unitIndex]}`;
};

/**
 * Formats a phone number to a standard format
 * @param {string} phoneNumber - Raw phone number input
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(
      3,
      6
    )}-${cleaned.substring(6, 10)}`;
  } else if (cleaned.length === 11 && cleaned.charAt(0) === "1") {
    return `1 (${cleaned.substring(1, 4)}) ${cleaned.substring(
      4,
      7
    )}-${cleaned.substring(7, 11)}`;
  }

  // Return original if unable to format
  return phoneNumber;
};

/**
 * Formats a credit card number with proper spacing and masking
 * @param {string} cardNumber - Credit card number
 * @param {boolean} mask - Whether to mask the card number (default: true)
 * @returns {string} Formatted card number
 */
export const formatCardNumber = (cardNumber, mask = true) => {
  // Remove all spaces and non-digit characters
  const cleaned = cardNumber.replace(/\D/g, "");

  if (mask) {
    // Show only last 4 digits
    const lastFour = cleaned.slice(-4);
    const masked = "XXXX-XXXX-XXXX-" + lastFour;
    return masked;
  } else {
    // Format with proper spacing
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substring(i, i + 4));
    }
    return parts.join("-");
  }
};

export default {
  formatCurrency,
  formatPercentage,
  formatDate,
  formatRelativeDate,
  truncateString,
  formatTransactionDescription,
  formatLargeNumber,
  formatPhoneNumber,
  formatCardNumber,
};
