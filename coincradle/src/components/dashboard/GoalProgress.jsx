import React from 'react';

const GoalProgress = ({ goals, loading, onAddGoal }) => {
  if (loading) {
    return (
      <div className="animate-pulse rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-48 rounded bg-gray-200"></div>
          <div className="h-6 w-24 rounded bg-gray-200"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="space-y-2 rounded-lg bg-gray-100 p-4">
              <div className="h-5 w-32 rounded bg-gray-200"></div>
              <div className="h-4 w-24 rounded bg-gray-200"></div>
              <div className="h-3 w-full rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Financial Goals</h2>
        <button
          onClick={onAddGoal}
          className="text-blue-600 hover:text-blue-800"
        >
          Add Goal
        </button>
      </div>
      
      {goals.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="mb-3 text-gray-600">You don't have any financial goals yet</p>
          <button
            onClick={onAddGoal}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium text-gray-800">{goal.name}</h3>
              <p className="mb-1 mt-1 text-sm text-gray-500">
                Target Date: {formatDate(goal.targetDate)}
              </p>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {calculateProgress(goal.currentAmount, goal.targetAmount).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div 
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalProgress;