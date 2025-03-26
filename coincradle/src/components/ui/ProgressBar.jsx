// src/components/ui/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ 
  value, 
  max = 100, 
  height = 8, 
  color = 'blue', 
  showPercentage = true,
  className = ''
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  // Define color classes
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    gray: 'bg-gray-500'
  };
  
  const barColor = colorClasses[color] || 'bg-blue-500';
  
  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="mb-1 flex justify-between">
          <span className="text-xs font-medium text-gray-700">Progress</span>
          <span className="text-xs font-medium text-gray-700">{percentage}%</span>
        </div>
      )}
      <div 
        className="w-full overflow-hidden rounded-full bg-gray-200"
        style={{ height: `${height}px` }}
      >
        <div 
          className={`${barColor} rounded-full`}
          style={{ width: `${percentage}%`, height: '100%' }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;