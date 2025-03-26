// src/components/investments/MarketInsights.jsx
import React, { useState, useEffect } from 'react';
import { financeApi } from '../../api/finance';
import { LineChart } from '../ui/LineChart';

const MarketInsights = () => {
  const [insights, setInsights] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1w'); // 1d, 1w, 1m, 3m, 1y, 5y

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // We'd use an actual market data API in a real implementation
        const response = await financeApi.getMarketData(timeframe);
        setMarketData(response.data);
        setInsights(response.insights);
        setNewsItems(response.news || []);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to load market data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [timeframe]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-2 text-gray-600">Loading market insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-gray-500">No market data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-800">Market Insights</h2>
        <div className="flex rounded-md border border-gray-300">
          {['1d', '1w', '1m', '3m', '1y', '5y'].map((period) => (
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

      {/* Market Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {marketData.indices.map((index) => (
          <div key={index.symbol} className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-500">{index.name}</p>
            <p className="text-xl font-bold text-gray-900">{index.price.toFixed(2)}</p>
            <div className="flex items-center">
              <span className={`text-sm ${
                index.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(index.change)}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {formatDate(index.date)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="mb-6">
        <h3 className="mb-2 font-medium text-gray-700">S&P 500 Performance</h3>
        <div className="h-64">
          <LineChart 
            data={marketData.chartData} 
            xKey="date" 
            yKey="value" 
            height={256}
            color={marketData.chartData[0].value < marketData.chartData[marketData.chartData.length - 1].value ? '#10B981' : '#EF4444'}
          />
        </div>
      </div>

      {/* Market Insights */}
      {insights && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 font-medium text-blue-800">AI Market Analysis</h3>
          <p className="text-blue-700">{insights.summary}</p>
          {insights.factors && insights.factors.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-blue-800">Key Factors</h4>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-700">
                {insights.factors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Market News */}
      <div>
      <h3 className="mb-4 font-medium text-gray-700">Latest Market News</h3>
        
        {newsItems.length > 0 ? (
          <div className="space-y-4">
            {newsItems.map((news, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-800">{news.title}</h4>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span className="mr-2">{news.source}</span>
                  <span>•</span>
                  <span className="ml-2">{formatDate(news.date)}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{news.summary}</p>
                {news.url && (
                  <a 
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Read more
                  </a>
                )}
                {news.impact && (
                  <div className="mt-2 flex items-center">
                    <span className="mr-2 text-xs font-medium text-gray-500">Potential Impact:</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      news.impact === 'high'
                        ? 'bg-red-100 text-red-800'
                        : news.impact === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {news.impact.charAt(0).toUpperCase() + news.impact.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No recent news available.</p>
        )}
      </div>
      
      {/* Top Movers */}
      <div className="mt-6">
        <h3 className="mb-4 font-medium text-gray-700">Today's Top Movers</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Gainers */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-green-600">Top Gainers</h4>
            <div className="rounded-lg border border-gray-200">
              <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50 p-2 text-xs font-medium text-gray-500">
                <div>Symbol</div>
                <div>Price</div>
                <div>Change</div>
              </div>
              {marketData.topGainers.map((stock, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-3 p-2 text-sm ${
                    index !== marketData.topGainers.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="font-medium">{stock.symbol}</div>
                  <div>{formatCurrency(stock.price)}</div>
                  <div className="text-green-600">+{stock.change.toFixed(2)}%</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Losers */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-red-600">Top Losers</h4>
            <div className="rounded-lg border border-gray-200">
              <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50 p-2 text-xs font-medium text-gray-500">
                <div>Symbol</div>
                <div>Price</div>
                <div>Change</div>
              </div>
              {marketData.topLosers.map((stock, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-3 p-2 text-sm ${
                    index !== marketData.topLosers.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="font-medium">{stock.symbol}</div>
                  <div>{formatCurrency(stock.price)}</div>
                  <div className="text-red-600">{stock.change.toFixed(2)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sector Performance */}
      <div className="mt-6">
        <h3 className="mb-4 font-medium text-gray-700">Sector Performance</h3>
        
        <div className="space-y-3">
          {marketData.sectorPerformance.map((sector, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{sector.name}</span>
                <span className={`font-medium ${
                  sector.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(sector.change)}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div 
                  className={`h-full rounded-full ${
                    sector.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.abs(sector.change) * 5}%`, 
                    maxWidth: '100%' 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
        <p>
          Data as of {formatDate(marketData.asOf)}. Market data is delayed by at least 15 minutes.
        </p>
      </div>
    </div>
  );
};

export default MarketInsights;