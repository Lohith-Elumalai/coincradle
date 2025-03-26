// src/components/debt/CreditScore.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Spinner } from '../common/Spinner';
import { Modal } from '../common/Modal';
import { LineChart } from '../ui/LineChart';
import { ProgressBar } from '../ui/ProgressBar';
import useDebt from '../../hooks/useDebt';

const CreditScore = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creditData, setCreditData] = useState(null);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFactorsModal, setShowFactorsModal] = useState(false);
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const { getCreditScore, refreshCreditScore } = useDebt();

  useEffect(() => {
    fetchCreditData();
  }, []);

  const fetchCreditData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCreditScore();
      setCreditData(data);
    } catch (err) {
      setError('Failed to load credit score information. Please try again.');
      console.error('Error fetching credit data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshScore = async () => {
    setIsRefreshing(true);
    try {
      await refreshCreditScore();
      const updatedData = await getCreditScore();
      setCreditData(updatedData);
      setShowRefreshModal(false);
    } catch (err) {
      setError('Failed to refresh credit score. Please try again later.');
      console.error('Error refreshing credit score:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title="Error Loading Credit Score">
        {error}
        <Button variant="secondary" size="sm" onClick={fetchCreditData} className="mt-2">
          Try Again
        </Button>
      </Alert>
    );
  }

  if (!creditData) {
    return (
      <Alert type="info" title="Credit Score Not Available">
        Your credit score information is not available. Connect to a credit bureau to track your score.
        <Button variant="primary" size="sm" className="mt-2">
          Connect Credit Bureau
        </Button>
      </Alert>
    );
  }

  const getScoreRangeLabel = (score) => {
    if (score >= 800) return { label: 'Excellent', color: 'green' };
    if (score >= 740) return { label: 'Very Good', color: 'green' };
    if (score >= 670) return { label: 'Good', color: 'blue' };
    if (score >= 580) return { label: 'Fair', color: 'yellow' };
    return { label: 'Poor', color: 'red' };
  };

  const scoreRating = getScoreRangeLabel(creditData.currentScore);
  const scorePercentage = ((creditData.currentScore - 300) / (850 - 300)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Credit Score</h2>
        <div>
          <span className="text-sm text-gray-500 mr-2">
            Last updated: {creditData.lastUpdated}
          </span>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setShowRefreshModal(true)}
          >
            Refresh Score
          </Button>
        </div>
      </div>

      {/* Main Credit Score Card */}
      <Card className="bg-white">
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center mb-6 md:mb-0">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold">{creditData.currentScore}</div>
                    <div className={`text-lg font-medium text-${scoreRating.color}-600`}>
                      {scoreRating.label}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                  {creditData.scoreChange > 0 ? (
                    <div className="text-green-600 font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h6a1 1 0 011 1v2zm4 3a1 1 0 01-1 1h-6a1 1 0 01-1-1V8a1 1 0 011-1h6a1 1 0 011 1v2z" clipRule="evenodd" />
                      </svg>
                      +{creditData.scoreChange}
                    </div>
                  ) : creditData.scoreChange < 0 ? (
                    <div className="text-red-600 font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      {creditData.scoreChange}
                    </div>
                  ) : (
                    <div className="text-gray-600 font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      No change
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 w-full max-w-xs">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>300</span>
                  <span>850</span>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500`}
                    style={{ width: '100%' }}
                  >
                    <div 
                      className="h-full w-2 bg-black"
                      style={{ marginLeft: `${scorePercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-4">Score Factors</h3>
              <div className="space-y-4">
                {creditData.factors.slice(0, 3).map((factor, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{factor.name}</span>
                      <span className={`text-sm ${factor.impact === 'positive' ? 'text-green-600' : factor.impact === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                        {factor.impact === 'positive' ? 'Positive' : factor.impact === 'negative' ? 'Negative' : 'Neutral'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${factor.impact === 'positive' ? 'bg-green-600' : factor.impact === 'negative' ? 'bg-red-600' : 'bg-yellow-600'}`}
                        style={{ width: `${factor.strength}%` }}
                      />
                    </div>
                  </div>
                ))}
                {creditData.factors.length > 3 && (
                  <Button 
                    variant="text" 
                    size="sm"
                    onClick={() => setShowFactorsModal(true)}
                    className="mt-2"
                  >
                    See All Factors
                  </Button>
                )}
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setShowScoreDetails(true)}
                >
                  View Score Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Credit History Card */}
      <Card className="bg-white">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Credit Score History</h3>
          <div className="h-64">
            <LineChart 
              data={creditData.history} 
              xKey="date" 
              yKey="score"
              xLabel="Date"
              yLabel="Score"
              colors={['#4C51BF']}
              domain={[300, 850]}
            />
          </div>
        </div>
      </Card>

      {/* Credit Accounts Card */}
      <Card className="bg-white">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Credit Accounts</h3>
          {creditData.accounts && creditData.accounts.length > 0 ? (
            <div className="divide-y">
              {creditData.accounts.map((account, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-medium">{account.name}</span>
                      <span className="ml-2 text-sm text-gray-500">{account.type}</span>
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full ${account.status === 'Good Standing' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {account.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Balance</span>
                      <span className="font-medium">${account.balance.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Credit Limit</span>
                      <span className="font-medium">${account.limit.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Utilization</span>
                      <span className="font-medium">{account.utilization}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Payment History</span>
                      <span className="font-medium">{account.paymentHistory}</span>
                    </div>
                  </div>
                  {account.limit > 0 && (
                    <div className="mt-2">
                      <ProgressBar 
                        progress={account.utilization} 
                        color={account.utilization > 30 ? (account.utilization > 70 ? 'red' : 'yellow') : 'green'}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Alert type="info">
              No credit accounts found or account information is not available.
            </Alert>
          )}
        </div>
      </Card>

      {/* Credit Score Tips */}
      <Card className="bg-white">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">How to Improve Your Score</h3>
          <div className="space-y-4">
            {creditData.improvementTips.map((tip, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800">
                    {index + 1}
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-md font-medium">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Refresh Score Modal */}
      <Modal
        isOpen={showRefreshModal}
        onClose={() => setShowRefreshModal(false)}
        title="Refresh Credit Score"
      >
        <div className="space-y-4">
          <p>
            Refreshing your credit score will request the latest information from the credit bureau.
            This will not impact your credit score.
          </p>
          
          <Alert type="info" title="Credit Bureau">
            Your score data is provided by {creditData?.bureau || 'TransUnion'}.
            Updates may take up to 24 hours to process.
          </Alert>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="secondary" onClick={() => setShowRefreshModal(false)}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleRefreshScore}
            disabled={isRefreshing}
          >
            {isRefreshing ? <Spinner size="sm" /> : 'Refresh Score'}
          </Button>
        </div>
      </Modal>

      {/* All Factors Modal */}
      <Modal
        isOpen={showFactorsModal}
        onClose={() => setShowFactorsModal(false)}
        title="Credit Score Factors"
      >
        <div className="space-y-4">
          {creditData.factors.map((factor, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <div>
                  <span className="font-medium">{factor.name}</span>
                  {factor.weight && (
                    <span className="text-xs text-gray-500 ml-2">
                      ({factor.weight}% of score)
                    </span>
                  )}
                </div>
                <span className={`text-sm ${factor.impact === 'positive' ? 'text-green-600' : factor.impact === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                  {factor.impact === 'positive' ? 'Positive' : factor.impact === 'negative' ? 'Negative' : 'Neutral'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div 
                  className={`h-2.5 rounded-full ${factor.impact === 'positive' ? 'bg-green-600' : factor.impact === 'negative' ? 'bg-red-600' : 'bg-yellow-600'}`}
                  style={{ width: `${factor.strength}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">{factor.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShowFactorsModal(false)}>Close</Button>
        </div>
      </Modal>

      {/* Score Details Modal */}
      <Modal
        isOpen={showScoreDetails}
        onClose={() => setShowScoreDetails(false)}
        title="Credit Score Details"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Score Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Current Score</span>
                <span className="font-medium text-lg">{creditData.currentScore}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Rating</span>
                <span className={`font-medium text-lg text-${scoreRating.color}-600`}>
                  {scoreRating.label}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Score Range</span>
                <span className="font-medium">300-850</span>
              </div>
              <div>
                <span className="text-gray-500 block">Score Model</span>
                <span className="font-medium">{creditData.model || 'FICO Score 8'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Bureau</span>
                <span className="font-medium">{creditData.bureau || 'TransUnion'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Last Updated</span>
                <span className="font-medium">{creditData.lastUpdated}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Score Breakdown</h4>
            <div className="space-y-3">
              {creditData.breakdown && Object.entries(creditData.breakdown).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-sm font-medium">{value}%</span>
                  </div>
                  <ProgressBar progress={value} color="blue" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Historical Stats</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Highest Score</span>
                <span className="font-medium">{creditData.highestScore}</span>
                <span className="text-xs text-gray-500 block">{creditData.highestScoreDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Lowest Score</span>
                <span className="font-medium">{creditData.lowestScore}</span>
                <span className="text-xs text-gray-500 block">{creditData.lowestScoreDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block">1 Year Change</span>
                <span className={`font-medium ${creditData.yearChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {creditData.yearChange > 0 ? '+' : ''}{creditData.yearChange} pts
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">6 Month Change</span>
                <span className={`font-medium ${creditData.sixMonthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {creditData.sixMonthChange > 0 ? '+' : ''}{creditData.sixMonthChange} pts
                </span>
              </div>
            </div>
          </div>
          
          <Alert type="info" title="About Credit Scores">
            <p className="text-sm">
              Credit scores range from 300 to 850. Lenders use these scores to evaluate your 
              creditworthiness. Higher scores may help you qualify for better rates and terms.
            </p>
          </Alert>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShowScoreDetails(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CreditScore;