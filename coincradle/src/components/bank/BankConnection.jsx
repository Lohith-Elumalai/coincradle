// src/components/bank/BankConnection.jsx
import React, { useState } from 'react';

const BankConnection = ({ bank, onSubmit, onCancel, loading }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(credentials);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center">
        <img
          src={bank.logo}
          alt={bank.name}
          className="mr-3 h-10 w-10 object-contain"
        />
        <h2 className="text-lg font-medium text-gray-800">Connect to {bank.name}</h2>
      </div>

      <p className="mb-4 text-gray-600">
        Enter your {bank.name} online banking credentials to securely connect your accounts.
        Your credentials are encrypted and never stored.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
            disabled={loading}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
            disabled={loading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              'Connect'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <div className="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Secure Connection</h3>
            <p className="mt-1 text-sm text-blue-600">
              Your login credentials are encrypted and securely transmitted. We use bank-level
              security standards and never store your banking passwords.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankConnection;
