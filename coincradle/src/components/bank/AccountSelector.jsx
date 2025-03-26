// src/components/bank/AccountSelector.jsx
import React from 'react';

const AccountSelector = ({ 
  accounts, 
  selectedAccountIds, 
  onSelectionChange, 
  onFinish, 
  onCancel,
  loading 
}) => {
  const handleCheckboxChange = (accountId) => {
    const isSelected = selectedAccountIds.includes(accountId);
    onSelectionChange(accountId, !isSelected);
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-medium text-gray-800">Select Accounts to Connect</h2>
      
      <p className="mb-6 text-gray-600">
        Choose which accounts you'd like to add to FinanceAI. We recommend connecting all accounts
        to get the most comprehensive financial insights.
      </p>
      
      <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 p-3">
        <span className="text-sm text-blue-700">
          {selectedAccountIds.length} of {accounts.length} accounts selected
        </span>
        <button
          onClick={() => {
            if (selectedAccountIds.length === accounts.length) {
              // Deselect all
              onSelectionChange([], false);
            } else {
              // Select all
              onSelectionChange(accounts.map(acc => acc.id), true);
            }
          }}
          className="text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          {selectedAccountIds.length === accounts.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="mb-6 max-h-96 overflow-y-auto space-y-2">
        {accounts.map((account) => (
          <div 
            key={account.id} 
            className={`flex items-center justify-between rounded-lg border p-4 ${
              selectedAccountIds.includes(account.id) 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`account-${account.id}`}
                checked={selectedAccountIds.includes(account.id)}
                onChange={() => handleCheckboxChange(account.id)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`account-${account.id}`} className="ml-3 block">
                <span className="font-medium text-gray-800">{account.name}</span>
                <span className="block text-sm text-gray-500">{account.type}</span>
              </label>
            </div>
            <span className="font-medium text-gray-800">
              {formatCurrency(account.balance)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
          disabled={loading}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onFinish}
          className={`rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ${
            loading || selectedAccountIds.length === 0 ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={loading || selectedAccountIds.length === 0}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Processing...</span>
            </div>
          ) : (
            'Connect Selected Accounts'
          )}
        </button>
      </div>
    </div>
  );
};

export default AccountSelector;
