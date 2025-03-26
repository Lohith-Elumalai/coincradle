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