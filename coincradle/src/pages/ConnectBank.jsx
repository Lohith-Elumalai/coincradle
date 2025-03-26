<<<<<<< HEAD
// src/pages/ConnectBank.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FinanceDataContext from '../contexts/FinanceDataContext';
import BankConnection from '../components/bank/BankConnection';
import AccountSelector from '../components/bank/AccountSelector';
import { bankApi } from '../api/bankApi';

const ConnectBank = () => {
  const navigate = useNavigate();
  const { accounts, connectBankAccount } = useContext(FinanceDataContext);
  
  const [step, setStep] = useState(1);
  const [availableBanks, setAvailableBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [discoveredAccounts, setDiscoveredAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch available banks on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const banks = await bankApi.getAvailableBanks();
        setAvailableBanks(banks);
      } catch (err) {
        setError('Failed to load available banks. Please try again.');
        console.error('Error fetching banks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  // Handle bank selection
  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setStep(2);
  };

  // Handle bank credentials submission
  const handleCredentialsSubmit = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Connect to bank and discover available accounts
      const result = await bankApi.authenticateWithBank(selectedBank.id, credentials);
      setDiscoveredAccounts(result.accounts);
      
      // Pre-select all accounts by default
      setSelectedAccounts(result.accounts.map(account => account.id));
      
      setStep(3);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials and try again.');
      console.error('Authentication error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle account selection changes
  const handleAccountSelectionChange = (accountId, isSelected) => {
    if (isSelected) {
      setSelectedAccounts(prev => [...prev, accountId]);
    } else {
      setSelectedAccounts(prev => prev.filter(id => id !== accountId));
    }
  };

  // Complete connection process
  const handleFinishConnection = async () => {
    if (selectedAccounts.length === 0) {
      setError('Please select at least one account to connect.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await connectBankAccount({
        bankId: selectedBank.id,
        connectionId: discoveredAccounts[0].connectionId, // All accounts share the same connection
        accountIds: selectedAccounts
      });
      
      setSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to complete account connection. Please try again.');
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel connection process
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-3xl py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Connect Your Bank Account</h1>
        <p className="mt-1 text-gray-600">
          Securely connect your bank accounts to get personalized insights and recommendations
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className="ml-2 text-sm font-medium text-gray-700">Select Bank</div>
          </div>
          <div className={`h-1 w-16 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className="ml-2 text-sm font-medium text-gray-700">Connect</div>
          </div>
          <div className={`h-1 w-16 ${step > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <div className="ml-2 text-sm font-medium text-gray-700">Select Accounts</div>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
          <p>{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
          <p>Your accounts have been successfully connected! Redirecting to dashboard...</p>
        </div>
      )}

      {/* Step content */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        {step === 1 && (
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-800">Select Your Bank</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {availableBanks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankSelect(bank)}
                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-500 hover:bg-blue-50"
                  >
                    <img 
                      src={bank.logo} 
                      alt={bank.name} 
                      className="mb-2 h-12 w-12 object-contain"
                    />
                    <span className="text-center text-sm font-medium text-gray-800">{bank.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedBank && (
          <BankConnection 
            bank={selectedBank}
            onSubmit={handleCredentialsSubmit}
            onCancel={() => setStep(1)}
            loading={loading}
          />
        )}

        {step === 3 && (
          <AccountSelector
            accounts={discoveredAccounts}
            selectedAccountIds={selectedAccounts}
            onSelectionChange={handleAccountSelectionChange}
            onFinish={handleFinishConnection}
            onCancel={() => setStep(2)}
            loading={loading}
          />
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleCancel}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(prev => Math.min(prev + 1, 3))}
            className={`rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ${
              (step === 1 && !selectedBank) || loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={(step === 1 && !selectedBank) || loading}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleFinishConnection}
            className={`rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ${
              loading || selectedAccounts.length === 0 || success ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={loading || selectedAccounts.length === 0 || success}
          >
            Complete Connection
          </button>
        )}
      </div>
    </div>
=======
import { useContext } from 'react';
import { FinanceDataContext } from '../contexts/FinanceDataContext';
import { ProtectedRoute } from '../components/guards/ProtectedRoute';
import AccountSelector from '../components/bank/AccountSelector';

const ConnectBank = () => {
  const { connectBank, bankAccounts, isLoading, error } = useContext(FinanceDataContext);

  return (
    <ProtectedRoute>
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Connect Your Bank</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="mb-4 text-gray-600">
            Securely connect your bank account to get real-time financial insights.
            We use bank-grade encryption to protect your data.
          </p>

          <button
            onClick={connectBank}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Connecting...' : 'Connect Bank Account'}
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {bankAccounts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
              <AccountSelector accounts={bankAccounts} />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>

  );
};

export default ConnectBank;
