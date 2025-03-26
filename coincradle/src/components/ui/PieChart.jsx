import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

/**
 * PieChart component for visualizing distribution data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - The dataset to visualize [{name, value, color}]
 * @param {string} props.dataKey - The data key for the value
 * @param {string} props.nameKey - The data key for the segment name
 * @param {Array} props.colors - Array of colors for segments
 * @param {Function} props.formatValue - Function to format values in tooltip
 * @param {number} props.height - Height of the chart
 * @param {boolean} props.donut - Whether to show as a donut chart
 * @param {number} props.innerRadius - Inner radius percentage for donut (0-100)
 * @param {number} props.outerRadius - Outer radius percentage (0-100)
 * @param {string} props.label - Text to show in the center (donut only)
 */
export const PieChart = ({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
  formatValue = (value) => value,
  height = 300,
  donut = false,
  innerRadius = 60,
  outerRadius = 80,
  label = '',
  className = '',
  categoryColors = {}
}) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] border border-dashed rounded-lg bg-gray-50">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  // Use provided colors or fall back to defaults
  const getColor = (entry, index) => {
    // If the entry has a specific color
    if (entry.color) return entry.color;
    
    // If there's a predefined color for this category in the props
    if (categoryColors[entry[nameKey]]) return categoryColors[entry[nameKey]];
    
    // Fall back to the colors array
    return colors[index % colors.length];
  };

  // CustomTooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="text-sm font-medium">{data[nameKey]}</p>
          <p className="text-sm">
            <span className="font-medium">Value: </span>
            {formatValue(data[dataKey])}
          </p>
          {data.percentage !== undefined && (
            <p className="text-sm">
              <span className="font-medium">Percentage: </span>
              {data.percentage.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate percentages if not provided
  const totalValue = data.reduce((sum, item) => sum + item[dataKey], 0);
  const dataWithPercentages = data.map(item => ({
    ...item,
    percentage: item.percentage !== undefined ? item.percentage : (item[dataKey] / totalValue) * 100
  }));

  // Custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <ul className="flex flex-wrap justify-center mt-4 gap-x-6 gap-y-2">
        {payload.map((entry, index) => (
          <li key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value} ({dataWithPercentages.find(item => item[nameKey] === entry.value).percentage.toFixed(1)}%)</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`w-full h-[${height}px] ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={dataWithPercentages}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={donut ? `${innerRadius}%` : 0}
            outerRadius={`${outerRadius}%`}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {dataWithPercentages.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry, index)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </RechartsPieChart>
      </ResponsiveContainer>
      
      {donut && label && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-lg font-semibold">{label}</div>
        </div>
      )}
    </div>
  );
};

export default PieChart;