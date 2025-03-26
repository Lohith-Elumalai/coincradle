// src/components/ui/PieChart.jsx
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4'];

const PieChart = ({ 
  data, 
  nameKey, 
  valueKey, 
  height = 300, 
  innerRadius = 60, 
  outerRadius = 80,
  showTooltip = true,
  colors = COLORS
}) => {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50" 
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Assign colors to data points if not already present
  const processedData = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length]
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey={valueKey}
          nameKey={nameKey}
        >
          {processedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {showTooltip && (
          <Tooltip
            formatter={(value) => [`$${value}`, valueKey]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '0.375rem',
              padding: '0.5rem'
            }}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
