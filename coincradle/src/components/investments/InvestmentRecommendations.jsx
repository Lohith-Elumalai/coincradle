<<<<<<< HEAD
// src/components/investments/InvestmentRecommendations.jsx
=======
>>>>>>> 67a2b5ae3ea6b9a1b13c742106a90a0babea9ea8
import React, { useEffect, useState } from 'react';
import { aiService } from '../../services/ai.service';

const InvestmentRecommendations = ({ portfolio, riskProfile }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!portfolio) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await aiService.getInvestmentRecommendations({
          portfolio,
          riskProfile: riskProfile || 'moderate'
        });
        setRecommendations(data);
      } catch (err) {
        console.error('Error fetching investment recommendations:', err);
        setError('Failed to load recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [portfolio, riskProfile]);

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-2 text-gray-600">Loading recommendations...</p>
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

  if (!recommendations) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-gray-500">No recommendations available yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-lg font-medium text-gray-800">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          AI Investment Recommendations
        </div>
      </h2>
      
      <div className="mb-4 rounded-lg bg-blue-50 p-4">
        <p className="text-blue-700">{recommendations.summary}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="mb-2 font-medium text-gray-700">Risk Profile: {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}</h3>
        <p className="text-sm text-gray-500">{recommendations.riskAnalysis}</p>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Recommended Actions</h3>
        {recommendations.suggestions.map((suggestion, index) => (
          <div key={index} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">{suggestion.title}</h4>
              <button
                onClick={() => toggleExpand(index)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform ${
                    expanded[index] ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            
            <p className="mt-1 text-sm text-gray-600">{suggestion.shortDescription}</p>
            
            {expanded[index] && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-600">{suggestion.description}</p>
                
                {suggestion.ticker && (
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium text-gray-700">Ticker:</span>
                    <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                      {suggestion.ticker}
                    </span>
                  </div>
                )}
                
                {suggestion.allocation && (
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium text-gray-700">Suggested Allocation:</span>
                    <span className="text-sm text-gray-800">{suggestion.allocation}</span>
                  </div>
                )}
                
                {suggestion.reason && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Reasoning:</span>
                    <p className="mt-1 text-sm text-gray-600">{suggestion.reason}</p>
                  </div>
                )}
                
                {suggestion.riskLevel && (
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium text-gray-700">Risk Level:</span>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      suggestion.riskLevel === 'high'
                        ? 'bg-red-100 text-red-800'
                        : suggestion.riskLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {suggestion.riskLevel.charAt(0).toUpperCase() + suggestion.riskLevel.slice(1)}
                    </span>
                  </div>
                )}
                
                {suggestion.timeHorizon && (
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium text-gray-700">Time Horizon:</span>
                    <span className="text-sm text-gray-800">{suggestion.timeHorizon}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-xs text-gray-500">
        <p>
          These recommendations are based on AI analysis of your portfolio, market conditions, and risk profile.
          Always consult with a financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default InvestmentRecommendations;