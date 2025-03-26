// src/components/common/Chart.jsx
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const Chart = ({
  type = 'line',
  data = [],
  width = '100%',
  height = 300,
  margin = { top: 5, right: 20, left: 20, bottom: 5 },
  xAxis = true,
  yAxis = true,
  grid = true,
  tooltip = true,
  legend = true,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'],
  lineType = 'monotone',
  dataKey = 'value',
  xDataKey = 'name',
  labelKey = 'name',
  innerRadius = 0,
  outerRadius = '80%',
  className = '',
  title,
  subtitle,
  valueFormatter = (value) => value,
  animate = true,
  stacked = false,
  layout = 'vertical',
  ...props
}) => {
  const [chartData, setChartData] = useState([]);
  
  // Process data if needed
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setChartData(data);
    }
  }, [data]);

  // Return null if no data
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  // Determine if dataKey is a string or an array
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];
  
  // Determine the appropriate chart component based on the chart type
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={chartData} margin={margin} {...props}>
            {grid && <CartesianGrid strokeDasharray="3 3" />}
            {xAxis && <XAxis dataKey={xDataKey} />}
            {yAxis && <YAxis />}
            {tooltip && <Tooltip formatter={valueFormatter} />}
            {legend && <Legend />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type={lineType}
                dataKey={key}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
                animationDuration={animate ? 1500 : 0}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={chartData} margin={margin} layout={layout} {...props}>
            {grid && <CartesianGrid strokeDasharray="3 3" />}
            {xAxis && <XAxis dataKey={xDataKey} />}
            {yAxis && <YAxis />}
            {tooltip && <Tooltip formatter={valueFormatter} />}
            {legend && <Legend />}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                stackId={stacked ? 'stack' : undefined}
                animationDuration={animate ? 1500 : 0}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        return (
          <RechartsPieChart margin={margin} {...props}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={labelKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              animationDuration={animate ? 1500 : 0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
              ))}
            </Pie>
            {tooltip && <Tooltip formatter={valueFormatter} />}
            {legend && <Legend />}
          </RechartsPieChart>
        );

      case 'area':
        return (
          <AreaChart data={chartData} margin={margin} {...props}>
            {grid && <CartesianGrid strokeDasharray="3 3" />}
            {xAxis && <XAxis dataKey={xDataKey} />}
            {yAxis && <YAxis />}
            {tooltip && <Tooltip formatter={valueFormatter} />}
            {legend && <Legend />}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type={lineType}
                dataKey={key}
                fill={colors[index % colors.length]}
                stroke={colors[index % colors.length]}
                fillOpacity={0.3}
                stackId={stacked ? 'stack' : undefined}
                animationDuration={animate ? 1500 : 0}
              />
            ))}
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {title && <h3 className="mb-1 text-base font-medium text-gray-900">{title}</h3>}
      {subtitle && <p className="mb-4 text-sm text-gray-500">{subtitle}</p>}
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;