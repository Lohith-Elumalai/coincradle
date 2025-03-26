/**
 * Application-wide constants for the finance-ai app
 */

// API endpoints
export const API_ENDPOINTS = {
    BASE_URL: process.env.VITE_API_BASE_URL || 'https://api.finance-ai.com',
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
    },
    USER: {
      PROFILE: '/user/profile',
      PREFERENCES: '/user/preferences',
      UPDATE_PROFILE: '/user/update-profile',
      CHANGE_PASSWORD: '/user/change-password',
      DELETE_ACCOUNT: '/user/delete-account',
    },
    TRANSACTIONS: {
      LIST: '/transactions',
      DETAILS: '/transactions/:id',
      CREATE: '/transactions',
      UPDATE: '/transactions/:id',
      DELETE: '/transactions/:id',
      BULK_IMPORT: '/transactions/import',
      CATEGORIES: '/transactions/categories',
      SEARCH: '/transactions/search',
      RECURRING: '/transactions/recurring',
    },
    BUDGET: {
      OVERVIEW: '/budget',
      CATEGORIES: '/budget/categories',
      GOALS: '/budget/goals',
      CREATE: '/budget',
      UPDATE: '/budget/:id',
      DELETE: '/budget/:id',
      RECOMMENDATIONS: '/budget/recommendations',
    },
    ACCOUNTS: {
      LIST: '/accounts',
      DETAILS: '/accounts/:id',
      LINK: '/accounts/link',
      UNLINK: '/accounts/:id/unlink',
      SYNC: '/accounts/sync',
      BALANCES: '/accounts/balances',
    },
    INVESTMENTS: {
      PORTFOLIO: '/investments/portfolio',
      HISTORY: '/investments/history',
      PERFORMANCE: '/investments/performance',
      RECOMMENDATIONS: '/investments/recommendations',
      ALLOCATIONS: '/investments/allocations',
    },
    DEBT: {
      OVERVIEW: '/debt',
      ACCOUNTS: '/debt/accounts',
      PAYMENT_PLAN: '/debt/payment-plan',
      CREDIT_SCORE: '/debt/credit-score',
    },
    PLANNING: {
      GOALS: '/planning/goals',
      RETIREMENT: '/planning/retirement',
      PROJECTIONS: '/planning/projections',
    },
    AI: {
      ANALYSIS: '/ai/analysis',
      CHAT: '/ai/chat',
      RECOMMENDATIONS: '/ai/recommendations',
      INSIGHTS: '/ai/insights',
    },
    NOTIFICATIONS: {
      LIST: '/notifications',
      MARK_READ: '/notifications/:id/read',
      SETTINGS: '/notifications/settings',
    },
  };
  
  // Transaction categories
  export const TRANSACTION_CATEGORIES = {
    INCOME: {
      id: 'income',
      name: 'Income',
      icon: 'dollar-sign',
      color: '#4CAF50',
      subcategories: [
        { id: 'salary', name: 'Salary' },
        { id: 'freelance', name: 'Freelance' },
        { id: 'investments', name: 'Investment Income' },
        { id: 'gifts', name: 'Gifts Received' },
        { id: 'other_income', name: 'Other Income' },
      ],
    },
    HOUSING: {
      id: 'housing',
      name: 'Housing',
      icon: 'home',
      color: '#2196F3',
      subcategories: [
        { id: 'mortgage', name: 'Mortgage/Rent' },
        { id: 'utilities', name: 'Utilities' },
        { id: 'internet', name: 'Internet/Cable' },
        { id: 'maintenance', name: 'Maintenance/Repairs' },
        { id: 'insurance', name: 'Home Insurance' },
      ],
    },
    TRANSPORTATION: {
      id: 'transportation',
      name: 'Transportation',
      icon: 'car',
      color: '#FF9800',
      subcategories: [
        { id: 'car_payment', name: 'Car Payment' },
        { id: 'fuel', name: 'Fuel' },
        { id: 'public_transit', name: 'Public Transit' },
        { id: 'maintenance', name: 'Maintenance' },
        { id: 'parking', name: 'Parking/Tolls' },
        { id: 'rideshare', name: 'Rideshare/Taxi' },
      ],
    },
    FOOD: {
      id: 'food',
      name: 'Food',
      icon: 'shopping-basket',
      color: '#E91E63',
      subcategories: [
        { id: 'groceries', name: 'Groceries' },
        { id: 'restaurants', name: 'Restaurants/Dining Out' },
        { id: 'takeout', name: 'Takeout/Delivery' },
        { id: 'coffee_shops', name: 'Coffee Shops' },
      ],
    },
    HEALTHCARE: {
      id: 'healthcare',
      name: 'Healthcare',
      icon: 'activity',
      color: '#673AB7',
      subcategories: [
        { id: 'insurance', name: 'Health Insurance' },
        { id: 'doctor', name: 'Doctor Visits' },
        { id: 'pharmacy', name: 'Pharmacy' },
        { id: 'fitness', name: 'Gym/Fitness' },
      ],
    },
    ENTERTAINMENT: {
      id: 'entertainment',
      name: 'Entertainment',
      icon: 'film',
      color: '#F44336',
      subcategories: [
        { id: 'streaming', name: 'Streaming Services' },
        { id: 'events', name: 'Events/Concerts' },
        { id: 'hobbies', name: 'Hobbies' },
        { id: 'subscriptions', name: 'Subscriptions' },
      ],
    },
    PERSONAL: {
      id: 'personal',
      name: 'Personal',
      icon: 'user',
      color: '#9C27B0',
      subcategories: [
        { id: 'clothing', name: 'Clothing/Apparel' },
        { id: 'education', name: 'Education' },
        { id: 'personal_care', name: 'Personal Care' },
        { id: 'gifts', name: 'Gifts Given' },
      ],
    },
    SHOPPING: {
      id: 'shopping',
      name: 'Shopping',
      icon: 'shopping-cart',
      color: '#3F51B5',
      subcategories: [
        { id: 'electronics', name: 'Electronics' },
        { id: 'household', name: 'Household Items' },
        { id: 'online_shopping', name: 'Online Shopping' },
      ],
    },
    DEBT: {
      id: 'debt',
      name: 'Debt Payments',
      icon: 'credit-card',
      color: '#607D8B',
      subcategories: [
        { id: 'credit_card', name: 'Credit Card Payment' },
        { id: 'student_loans', name: 'Student Loans' },
        { id: 'personal_loan', name: 'Personal Loan' },
        { id: 'other_debt', name: 'Other Debt' },
      ],
    },
    SAVINGS: {
      id: 'savings',
      name: 'Savings & Investments',
      icon: 'trending-up',
      color: '#009688',
      subcategories: [
        { id: 'emergency_fund', name: 'Emergency Fund' },
        { id: 'retirement', name: 'Retirement' },
        { id: 'investments', name: 'Investments' },
        { id: 'goals', name: 'Savings Goals' },
      ],
    },
    TRAVEL: {
      id: 'travel',
      name: 'Travel',
      icon: 'map',
      color: '#CDDC39',
      subcategories: [
        { id: 'flights', name: 'Flights' },
        { id: 'accommodation', name: 'Accommodation' },
        { id: 'transportation', name: 'Transportation' },
        { id: 'activities', name: 'Activities/Tours' },
      ],
    },
    BUSINESS: {
      id: 'business',
      name: 'Business',
      icon: 'briefcase',
      color: '#795548',
      subcategories: [
        { id: 'supplies', name: 'Supplies' },
        { id: 'services', name: 'Services' },
        { id: 'marketing', name: 'Marketing' },
        { id: 'travel', name: 'Business Travel' },
      ],
    },
    MISCELLANEOUS: {
      id: 'miscellaneous',
      name: 'Miscellaneous',
      icon: 'more-horizontal',
      color: '#9E9E9E',
      subcategories: [
        { id: 'fees', name: 'Fees & Charges' },
        { id: 'taxes', name: 'Taxes' },
        { id: 'charity', name: 'Charitable Donations' },
        { id: 'other', name: 'Other' },
      ],
    },
  };
  
  // Financial account types
  export const ACCOUNT_TYPES = {
    CHECKING: { id: 'checking', name: 'Checking Account', icon: 'credit-card' },
    SAVINGS: { id: 'savings', name: 'Savings Account', icon: 'dollar-sign' },
    CREDIT_CARD: { id: 'credit_card', name: 'Credit Card', icon: 'credit-card' },
    LOAN: { id: 'loan', name: 'Loan', icon: 'trending-down' },
    INVESTMENT: { id: 'investment', name: 'Investment Account', icon: 'trending-up' },
    RETIREMENT: { id: 'retirement', name: 'Retirement Account', icon: 'sunrise' },
    REAL_ESTATE: { id: 'real_estate', name: 'Real Estate', icon: 'home' },
    OTHER: { id: 'other', name: 'Other', icon: 'more-horizontal' },
  };
  
  // Financial goal types
  export const GOAL_TYPES = {
    EMERGENCY_FUND: { id: 'emergency_fund', name: 'Emergency Fund', icon: 'shield' },
    SAVINGS: { id: 'savings', name: 'General Savings', icon: 'dollar-sign' },
    RETIREMENT: { id: 'retirement', name: 'Retirement', icon: 'sunset' },
    DEBT_PAYOFF: { id: 'debt_payoff', name: 'Debt Payoff', icon: 'trending-down' },
    HOME_PURCHASE: { id: 'home_purchase', name: 'Home Purchase', icon: 'home' },
    VACATION: { id: 'vacation', name: 'Vacation', icon: 'map' },
    CAR_PURCHASE: { id: 'car_purchase', name: 'Car Purchase', icon: 'car' },
    EDUCATION: { id: 'education', name: 'Education', icon: 'book' },
    WEDDING: { id: 'wedding', name: 'Wedding', icon: 'heart' },
    MAJOR_PURCHASE: { id: 'major_purchase', name: 'Major Purchase', icon: 'shopping-bag' },
    CUSTOM: { id: 'custom', name: 'Custom Goal', icon: 'target' },
  };
  
  // Date formats
  export const DATE_FORMATS = {
    API: 'YYYY-MM-DD',
    DISPLAY: 'MMM DD, YYYY',
    SHORT: 'MM/DD/YYYY',
    MONTH_YEAR: 'MMM YYYY',
    DAY_MONTH: 'DD MMM',
    TIME: 'h:mm A',
    DATETIME: 'MMM DD, YYYY h:mm A',
  };
  
  // Error messages
  export const ERROR_MESSAGES = {
    NETWORK: 'Network error. Please check your internet connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action. Please log in.',
    SERVER: 'Server error. Please try again later.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check the information you provided.',
    DEFAULT: 'Something went wrong. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    ACCOUNT_EXISTS: 'An account with this email already exists.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    WEAK_PASSWORD: 'Password is too weak. Please choose a stronger password.',
    INVALID_TOKEN: 'Invalid or expired token.',
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_MISMATCH: 'Passwords do not match.',
    BANK_CONNECTION_FAILED: 'Failed to connect to your bank. Please try again.',
  };
  
  // Success messages
  export const SUCCESS_MESSAGES = {
    LOGIN: 'Successfully logged in!',
    REGISTER: 'Account created successfully!',
    LOGOUT: 'You have been logged out.',
    PROFILE_UPDATE: 'Profile updated successfully!',
    PASSWORD_CHANGE: 'Password changed successfully!',
    PASSWORD_RESET: 'Password reset link has been sent to your email.',
    ACCOUNT_LINKED: 'Account linked successfully!',
    TRANSACTION_CREATED: 'Transaction created successfully!',
    TRANSACTION_UPDATED: 'Transaction updated successfully!',
    TRANSACTION_DELETED: 'Transaction deleted successfully!',
    BUDGET_CREATED: 'Budget created successfully!',
    BUDGET_UPDATED: 'Budget updated successfully!',
    GOAL_CREATED: 'Financial goal created successfully!',
    GOAL_UPDATED: 'Financial goal updated successfully!',
    DATA_SAVED: 'Data saved successfully!',
  };
  
  // Chart colors
  export const CHART_COLORS = {
    PRIMARY: ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8AB4F8'],
    SECONDARY: ['#0074D9', '#2ECC40', '#FFDC00', '#FF4136', '#7FDBFF'],
    MONOCHROME: ['#0074D9', '#0066BF', '#0058A6', '#004A8C', '#003D73'],
    PASTEL: ['#74B9FF', '#55EFC4', '#FFD866', '#FF7675', '#A29BFE'],
    DARK: ['#2C3E50', '#34495E', '#7F8C8D', '#2C3A47', '#1E272E'],
  };
  
  // Theme settings
  export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  };
  
  // Investment asset classes
  export const ASSET_CLASSES = {
    US_STOCKS: { id: 'us_stocks', name: 'US Stocks', color: '#4285F4' },
    INTL_STOCKS: { id: 'intl_stocks', name: 'International Stocks', color: '#34A853' },
    EMERGING_MARKETS: { id: 'emerging_markets', name: 'Emerging Markets', color: '#FBBC05' },
    US_BONDS: { id: 'us_bonds', name: 'US Bonds', color: '#EA4335' },
    INTL_BONDS: { id: 'intl_bonds', name: 'International Bonds', color: '#8AB4F8' },
    REAL_ESTATE: { id: 'real_estate', name: 'Real Estate', color: '#0074D9' },
    COMMODITIES: { id: 'commodities', name: 'Commodities', color: '#2ECC40' },
    CRYPTO: { id: 'crypto', name: 'Cryptocurrency', color: '#FFDC00' },
    CASH: { id: 'cash', name: 'Cash', color: '#FF4136' },
    OTHER: { id: 'other', name: 'Other', color: '#7FDBFF' },
  };
  
  // Credit score ranges
  export const CREDIT_SCORE_RANGES = {
    EXCELLENT: { min: 800, max: 850, label: 'Excellent', color: '#2ECC40' },
    VERY_GOOD: { min: 740, max: 799, label: 'Very Good', color: '#01FF70' },
    GOOD: { min: 670, max: 739, label: 'Good', color: '#FFDC00' },
    FAIR: { min: 580, max: 669, label: 'Fair', color: '#FF851B' },
    POOR: { min: 300, max: 579, label: 'Poor', color: '#FF4136' },
  };
  
  // App routes
  export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    BUDGET: '/budget',
    INVESTMENTS: '/investments',
    DEBT: '/debt-management',
    PLANNING: '/financial-planning',
    CHAT: '/ai-chat',
    CONNECT_BANK: '/connect-bank',
    SETTINGS: '/settings',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password/:token',
    PROFILE: '/profile',
    NOT_FOUND: '/404',
  };
  
  // Time periods for financial data
  export const TIME_PERIODS = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly',
    CUSTOM: 'custom',
  };
  
  // Currency codes
  export const CURRENCY_CODES = {
    USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
    CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
    AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    MXN: { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  };
  
  // Financial ratios targets
  export const FINANCIAL_RATIO_TARGETS = {
    EMERGENCY_FUND: { min: 3, ideal: 6, unit: 'months' },
    DEBT_TO_INCOME: { max: 0.36, warning: 0.43, unit: 'ratio' },
    HOUSING_EXPENSE: { max: 0.28, warning: 0.36, unit: 'ratio' },
    SAVINGS_RATE: { min: 0.15, ideal: 0.2, unit: 'ratio' },
    DEBT_TO_ASSET: { max: 0.5, warning: 0.8, unit: 'ratio' },
    NET_WORTH_TO_INCOME: { min: 1, ideal: 3, unit: 'ratio' },
  };
  
  // Local storage expiration times (in milliseconds)
  export const STORAGE_EXPIRY = {
    AUTH_TOKEN: 24 * 60 * 60 * 1000, // 24 hours
    USER_DATA: 7 * 24 * 60 * 60 * 1000, // 7 days
    TRANSACTION_CACHE: 1 * 60 * 60 * 1000, // 1 hour
    PREFERENCES: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  
  // App constants
  export const APP_CONSTANTS = {
    APP_NAME: 'Finance AI',
    APP_VERSION: '1.0.0',
    COPYRIGHT_YEAR: new Date().getFullYear(),
    MAX_FILE_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_TRANSACTIONS_PER_PAGE: 50,
    DEFAULT_CURRENCY: 'USD',
    DEFAULT_LOCALE: 'en-US',
    API_TIMEOUT: 30000, // 30 seconds
    DEBOUNCE_DELAY: 300, // 300ms
    PASSWORD_MIN_LENGTH: 8,
    MOBILE_BREAKPOINT: 768, // in pixels
    DEFAULT_DATE_RANGE: 30, // last 30 days
  };
  
  export default {
    API_ENDPOINTS,
    TRANSACTION_CATEGORIES,
    ACCOUNT_TYPES,
    GOAL_TYPES,
    DATE_FORMATS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    CHART_COLORS,
    THEMES,
    ASSET_CLASSES,
    CREDIT_SCORE_RANGES,
    ROUTES,
    TIME_PERIODS,
    CURRENCY_CODES,
    FINANCIAL_RATIO_TARGETS,
    STORAGE_EXPIRY,
    APP_CONSTANTS
  };