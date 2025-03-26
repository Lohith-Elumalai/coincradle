
// src/pages/Investments.jsx
import React, { useState, useEffect, useContext } from 'react';
import FinanceDataContext from '../contexts/FinanceDataContext';
import { financeApi } from '../api/finance';
import { aiService } from '../services/ai.service';
import { LineChart } from '../components/ui/LineChart';
import { PieChart } from '../components/ui/PieChart';

const Investments = () => {
  const { investments, loading } = useContext(FinanceDataContext);
  const [portfolioPerformance, setPortfolioPerformance] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [timeframe, setTimeframe] = useState('1m'); // 1m, 3m, 6m, 1y, all
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Fetch portfolio performance data
  useEffect(() => {
    const fetchPerformance = async () => {
      if (investments && investments.length > 0) {
        setLoadingPerformance(true);
        try {
          const data = await financeApi.getPortfolioPerformance(timeframe);
          setPortfolioPerformance(data);
        } catch (err) {
          console.error('Error fetching portfolio performance:', err);
        } finally {
          setLoadingPerformance(false);
        }
      }
    };

    fetchPerformance();
  }, [investments, timeframe]);

  // Fetch AI investment recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (investments && investments.length > 0) {
        setLoadingRecommendations(true);
        try {
          const data = await aiService.getInvestmentRecommendations({
            portfolio: investments,
            riskProfile: 'moderate' // This could be dynamic based on user profile
          });
          setRecommendations(data);
        } catch (err) {
          console.error('Error fetching investment recommendations:', err);
        } finally {
          setLoadingRecommendations(false);
        }
      }
    };

    fetchRecommendations();
  }, [investments]);

  // Calculate portfolio metrics
  const calculateMetrics = () => {
    if (!investments || investments.length === 0) return null;

    const totalValue = investments.reduce((sum, investment) => sum + investment.currentValue, 0);
    const totalCost = investments.reduce((sum, investment) => sum + investment.purchaseValue, 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercent = (totalGain / totalCost) * 100;

    return {
      totalValue,
      totalCost,
      totalGain,
      totalGainPercent
    };
  };

  const metrics = calculateMetrics();

  // Prepare allocation data for pie chart
  const getAllocationData = () => {
    if (!investments || investments.length === 0) return [];

    const totalValue = investments.reduce((sum, investment) => sum + investment.currentValue, 0);
    
    // Group by asset class
    const assetClasses = {};
    investments.forEach(investment => {
      if (!assetClasses[investment.assetClass]) {
        assetClasses[investment.assetClass] = 0;
      }
      assetClasses[investment.assetClass] += investment.currentValue;
    });

    // Convert to array for pie chart
    return Object.entries(assetClasses).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalValue) * 100).toFixed(1)
    }));
  };

  const allocationData = getAllocationData();

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Investment Portfolio</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {/* Add implementation */}}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add Investment
          </button>
        </div>
      </div>

      {loading.investments ? (
        <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-md">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-2 text-gray-600">Loading investment data...</p>
        </div>
      ) : investments && investments.length > 0 ? (
        <>
          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalValue)}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <p className="text-sm font-medium text-gray-500">Total Cost</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalCost)}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <p className="text-sm font-medium text-gray-500">Total Gain/Loss</p>
              <p className={`mt-1 text-2xl font-bold ${
                metrics.totalGain >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(metrics.totalGain)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <p className="text-sm font-medium text-gray-500">Return %</p>
              <p className={`mt-1 text-2xl font-bold ${
                metrics.totalGainPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.totalGainPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Portfolio Performance */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Portfolio Performance</h2>
                <div className="flex rounded-md border border-gray-300">
                  {['1m', '3m', '6m', '1y', 'all'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period)}
                      className={`px-3 py-1 text-sm ${
                        timeframe === period
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              {loadingPerformance ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : portfolioPerformance ? (
                <div className="h-64">
                  <LineChart 
                    data={portfolioPerformance.data} 
                    xKey="date" 
                    yKey="value" 
                    height={256}
                    color="#10B981"
                  />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-gray-500">No performance data available</p>
                </div>
              )}
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-medium text-gray-800">Asset Allocation</h2>
              <div className="h-48">
                <PieChart 
                  data={allocationData} 
                  nameKey="name" 
                  valueKey="value" 
                />
              </div>
              <div className="mt-4 space-y-2">
                {allocationData.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="mr-2 h-3 w-3 rounded-full" 
                        style={{ backgroundColor: asset.color }}
                      ></div>
                      <span className="text-sm font-medium">{asset.name}</span>
                    </div>
                    <span className="text-sm text-gray-700">{asset.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Investment Holdings */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-medium text-gray-800">Investment Holdings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Investment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Purchase Value
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Current Value
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Gain/Loss
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Return %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {investments.map((investment) => {
                    const gain = investment.currentValue - investment.purchaseValue;
                    const gainPercent = (gain / investment.purchaseValue) * 100;
                    
                    return (
                      <tr key={investment.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                              <div className="text-sm text-gray-500">{investment.ticker}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-900">{investment.assetClass}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-900">{formatCurrency(investment.purchaseValue)}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-900">{formatCurrency(investment.currentValue)}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className={`text-sm ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(gain)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className={`text-sm ${gainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {gainPercent.toFixed(2)}%
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                    </tbody>
                    </table>
                    </div>
                    </div>
                    
                    {/* AI Recommendations */}
                    {recommendations && (
                    <div className="rounded-lg bg-white p-6 shadow-md">
                    <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h2 className="text-lg font-medium text-gray-800">AI Investment Recommendations</h2>
                    </div>
                    
                    <div className="mt-4 rounded-lg bg-blue-50 p-4">
                    <p className="text-blue-800">{recommendations.summary}</p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recommendations.suggestions.map((suggestion, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4">
                      <h3 className="mb-2 font-medium text-gray-800">{suggestion.title}</h3>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                      {suggestion.ticker && (
                        <div className="mt-2">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {suggestion.ticker}
                          </span>
                        </div>
                      )}
                    </div>
                    ))}
                    </div>
                    </div>
                    )}
                    </>
                    ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="mt-4 text-xl font-medium text-gray-800">No Investments Found</h2>
                    <p className="mt-2 text-center text-gray-600">
                    You don't have any investments added to your portfolio yet. Add your first investment to get started.
                    </p>
                    <button
                    onClick={() => {/* Add implementation */}}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                    Add Investment
                    </button>
                    </div>
                    )}
                    </div>
                    );
                    };
                    
                    export default Investments;
                    