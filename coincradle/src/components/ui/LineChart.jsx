// src/components/ui/LineChart.jsx
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChart = ({ 
  data, 
  xKey, 
  yKey, 
  height = 300, 
  color = '#3B82F6', 
  showGrid = true, 
  showTooltip = true 
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />}
        <XAxis 
          dataKey={xKey}
          tick={{ fontSize: 12, fill: '#6B7280' }}
          tickLine={{ stroke: '#E5E7EB' }}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#6B7280' }}
          tickLine={{ stroke: '#E5E7EB' }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickFormatter={(value) => `$${value}`}
        />
        {showTooltip && (
          <Tooltip
            formatter={(value) => [`$${value}`, yKey]}
            labelFormatter={(value) => `${value}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '0.375rem',
              padding: '0.5rem'
            }}
          />
        )}
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke={color} 
          strokeWidth={2} 
          dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
          activeDot={{ r: 6, strokeWidth: 0, fill: color }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
