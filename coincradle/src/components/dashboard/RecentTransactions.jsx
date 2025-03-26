import React from 'react';

const RecentTransactions = ({ transactions, loading, onViewAll }) => {
  if (loading) {
    return (
      <div className="animate-pulse rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-48 rounded bg-gray-200"></div>
          <div className="h-6 w-24 rounded bg-gray-200"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-200"></div>
                <div>
                  <div className="h-4 w-32 rounded bg-gray-200"></div>
                  <div className="mt-1 h-3 w-24 rounded bg-gray-200"></div>
                </div>
              </div>
              <div className="h-5 w-16 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    const iconMap = {
      'food': '🍔',
      'groceries': '🛒',
      'shopping': '🛍️',
      'transportation': '🚗',
      'entertainment': '🎬',
      'utilities': '💡',
      'housing': '🏠',
      'health': '🏥',
      'income': '💰',
      'transfer': '↔️',
      'other': '📝'
    };
    
    return iconMap[category.toLowerCase()] || '📝';
  };

  const getTransactionColor = (amount) => {
    return amount < 0 ? 'text-red-600' : 'text-green-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
        <button
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-800"
        >
          View All
        </button>
      </div>
      
      {transactions.length === 0 ? (
        <div className="py-4 text-center text-gray-500">
          <p>No recent transactions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b border-gray-200 pb-3"
            >
              <div className="flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg">
                  {getCategoryIcon(transaction.category)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.date)} • {transaction.category}
                  </p>
                </div>
              </div>
              <p className={`font-bold ${getTransactionColor(transaction.amount)}`}>
                {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;