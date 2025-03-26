import React from 'react';

const FinancialOverview = ({ accounts, totalBalance, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse rounded-lg bg-white p-6 shadow-lg">
        <div className="h-6 w-48 rounded bg-gray-200"></div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-lg bg-gray-100 p-4">
              <div className="h-4 w-24 rounded bg-gray-200"></div>
              <div className="mt-2 h-6 w-32 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Financial Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Total Balance */}
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-600">Total Balance</p>
          <p className="mt-1 text-2xl font-bold text-blue-800">${totalBalance.toFixed(2)}</p>
        </div>
        
        {/* Account Cards */}
        {accounts.map((account) => (
          <div key={account.id} className="rounded-lg bg-gray-100 p-4">
            <p className="text-sm font-medium text-gray-600">{account.name}</p>
            <p className="mt-1 text-xl font-bold text-gray-800">${account.balance.toFixed(2)}</p>
            <p className="mt-1 text-xs text-gray-500">{account.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialOverview;