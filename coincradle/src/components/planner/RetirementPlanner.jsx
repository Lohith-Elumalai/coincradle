import React, { useState, useEffect } from 'react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { useAI } from '../../hooks/useAI';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Toggle from '../common/Toggle';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import LineChart from '../ui/LineChart';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateCompoundInterest, calculateRetirementNeeds } from '../../utils/calculations';

const RetirementPlanner = () => {
  const { userFinancialData, updateUserFinancialData } = useFinanceData();
  const { getRetirementRecommendations, isLoading } = useAI();
  const [showRetirementModal, setShowRetirementModal] = useState(false);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  
  // Retirement planning form state
  const [retirementPlan, setRetirementPlan] = useState({
    currentAge: userFinancialData?.retirement?.currentAge || 30,
    retirementAge: userFinancialData?.retirement?.retirementAge || 65,
    lifeExpectancy: userFinancialData?.retirement?.lifeExpectancy || 90,
    currentSavings: userFinancialData?.retirement?.currentSavings || 0,
    monthlySavings: userFinancialData?.retirement?.monthlySavings || 0,
    desiredRetirementIncome: userFinancialData?.retirement?.desiredRetirementIncome || 0,
    expectedAnnualReturn: userFinancialData?.retirement?.expectedAnnualReturn || 7,
    expectedInflationRate: userFinancialData?.retirement?.expectedInflationRate || 2.5,
    adjustForInflation: userFinancialData?.retirement?.adjustForInflation || true,
    includeSocialSecurity: userFinancialData?.retirement?.includeSocialSecurity || true,
    estimatedSocialSecurityBenefit: userFinancialData?.retirement?.estimatedSocialSecurityBenefit || 2000,
    includeAdditionalIncome: userFinancialData?.retirement?.includeAdditionalIncome || false,
    additionalIncomeAmount: userFinancialData?.retirement?.additionalIncomeAmount || 0,
    additionalIncomeDescription: userFinancialData?.retirement?.additionalIncomeDescription || '',
  });

  // Computed retirement data
  const [retirementProjection, setRetirementProjection] = useState({
    yearsUntilRetirement: 0,
    yearsInRetirement: 0,
    projectedSavingsAtRetirement: 0,
    projectedMonthlyRetirementIncome: 0,
    requiredSavingsAtRetirement: 0,
    savingsGap: 0,
    monthlyContributionToReachGoal: 0,
    projectedSavingsRunsOutAge: 0,
    onTrack: false,
    projectionData: [],
  });

  // Calculate retirement projection on page load and when plan changes
  useEffect(() => {
    if (userFinancialData?.retirement) {
      calculateRetirementProjection();
    }
  }, [userFinancialData?.retirement]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRetirementPlan((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    }));
  };

  const saveRetirementPlan = () => {
    const updatedData = {
      ...userFinancialData,
      retirement: retirementPlan
    };
    
    updateUserFinancialData(updatedData);
    setShowRetirementModal(false);
    calculateRetirementProjection();
  };

  const calculateRetirementProjection = () => {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      monthlySavings,
      desiredRetirementIncome,
      expectedAnnualReturn,
      expectedInflationRate,
      adjustForInflation,
      includeSocialSecurity,
      estimatedSocialSecurityBenefit,
      includeAdditionalIncome,
      additionalIncomeAmount,
    } = retirementPlan;

    // Basic calculations
    const yearsUntilRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    const annualSavings = monthlySavings * 12;

    // Calculate inflation-adjusted return rate if needed
    const effectiveReturnRate = adjustForInflation
      ? (1 + expectedAnnualReturn / 100) / (1 + expectedInflationRate / 100) - 1
      : expectedAnnualReturn / 100;

    // Calculate future value of current savings at retirement
    const futureValueCurrentSavings = calculateCompoundInterest(
      currentSavings,
      0,
      effectiveReturnRate,
      yearsUntilRetirement
    );

    // Calculate future value of monthly contributions at retirement
    const futureValueContributions = calculateCompoundInterest(
      0,
      annualSavings,
      effectiveReturnRate,
      yearsUntilRetirement
    );

    // Total projected savings at retirement
    const projectedSavingsAtRetirement = futureValueCurrentSavings + futureValueContributions;

    // Calculate additional income in retirement
    let monthlyAdditionalIncome = 0;
    if (includeSocialSecurity) {
      monthlyAdditionalIncome += estimatedSocialSecurityBenefit;
    }
    if (includeAdditionalIncome) {
      monthlyAdditionalIncome += additionalIncomeAmount;
    }
    const annualAdditionalIncome = monthlyAdditionalIncome * 12;

    // Calculate required savings at retirement using the 4% rule as a starting point
    // but adjust based on expected return during retirement and desired income
    const annualDesiredRetirementIncome = desiredRetirementIncome * 12;
    const annualRetirementNeedFromSavings = annualDesiredRetirementIncome - annualAdditionalIncome;
    
    // Calculate required savings to generate desired income through retirement years
    const requiredSavingsAtRetirement = calculateRetirementNeeds(
      annualRetirementNeedFromSavings,
      effectiveReturnRate,
      yearsInRetirement
    );

    // Calculate savings gap
    const savingsGap = requiredSavingsAtRetirement - projectedSavingsAtRetirement;

    // Calculate required additional monthly contribution to close gap
    const requiredAdditionalMonthlyContribution = savingsGap > 0
      ? calculateMonthlyContributionNeeded(savingsGap, effectiveReturnRate, yearsUntilRetirement)
      : 0;

    // Calculate when money runs out in retirement
    let moneyRunsOutAge = retirementAge;
    let remainingSavings = projectedSavingsAtRetirement;
    const yearlyRetirementWithdrawal = annualRetirementNeedFromSavings;
    
    // Generate year-by-year projection data
    const projectionData = [];
    
    // Pre-retirement projection
    for (let age = currentAge; age <= retirementAge; age++) {
      const yearsSinceCurrent = age - currentAge;
      const savings = currentSavings * Math.pow(1 + effectiveReturnRate, yearsSinceCurrent) +
        (annualSavings * (Math.pow(1 + effectiveReturnRate, yearsSinceCurrent) - 1)) / effectiveReturnRate;
      
      projectionData.push({
        age,
        savings,
        phase: 'accumulation',
      });
    }
    
    // Retirement phase projection
    for (let age = retirementAge + 1; age <= lifeExpectancy; age++) {
      remainingSavings = remainingSavings * (1 + effectiveReturnRate) - yearlyRetirementWithdrawal;
      
      if (remainingSavings <= 0 && moneyRunsOutAge === retirementAge) {
        moneyRunsOutAge = age;
        remainingSavings = 0;
      }
      
      projectionData.push({
        age,
        savings: Math.max(0, remainingSavings),
        phase: 'distribution',
      });
    }

    // Update retirement projection state
    setRetirementProjection({
      yearsUntilRetirement,
      yearsInRetirement,
      projectedSavingsAtRetirement,
      projectedMonthlyRetirementIncome: (projectedSavingsAtRetirement / yearsInRetirement / 12) + monthlyAdditionalIncome,
      requiredSavingsAtRetirement,
      savingsGap,
      monthlyContributionToReachGoal: monthlySavings + requiredAdditionalMonthlyContribution,
      projectedSavingsRunsOutAge: moneyRunsOutAge,
      onTrack: savingsGap <= 0,
      projectionData,
    });
  };

  const calculateMonthlyContributionNeeded = (targetAmount, annualRate, years) => {
    // PMT formula: Calculate monthly payment needed to reach a future value
    const monthlyRate = annualRate / 12;
    const totalMonths = years * 12;
    return (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  };

  const getAIRecommendations = async () => {
    try {
      const recommendations = await getRetirementRecommendations({
        currentRetirementPlan: retirementPlan,
        retirementProjection,
        userFinancialData,
      });
      
      setRecommendations(recommendations);
      setShowRecommendationsModal(true);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
    }
  };

  const getRetirementHealthStatus = () => {
    const { onTrack, savingsGap, yearsUntilRetirement } = retirementProjection;
    
    if (onTrack) {
      return {
        status: 'On Track',
        icon: '✅',
        description: 'You\'re on track to meet your retirement goals!',
        color: 'text-green-600',
      };
    } else if (savingsGap > 0 && yearsUntilRetirement >= 10) {
      return {
        status: 'Needs Attention',
        icon: '⚠️',
        description: 'You have time, but need to increase your retirement savings.',
        color: 'text-yellow-600',
      };
    } else {
      return {
        status: 'Action Required',
        icon: '🚨',
        description: 'Significant changes needed to meet your retirement goals.',
        color: 'text-red-600',
      };
    }
  };

  const healthStatus = getRetirementHealthStatus();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Retirement Planning</h2>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => setShowRetirementModal(true)}
          >
            Edit Retirement Plan
          </Button>
          <Button onClick={getAIRecommendations} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Get AI Recommendations'}
          </Button>
        </div>
      </div>

      {!userFinancialData?.retirement ? (
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No retirement plan set up</h3>
            <p className="text-gray-500 mb-4">Create your retirement plan to see projections and recommendations.</p>
            <Button onClick={() => setShowRetirementModal(true)}>Setup Retirement Plan</Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Retirement Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Retirement Projection</h3>
              <div className="h-64">
                <LineChart 
                  data={retirementProjection.projectionData}
                  xKey="age"
                  yKey="savings"
                  xLabel="Age"
                  yLabel="Projected Savings"
                  colorByKey="phase"
                  colorMap={{
                    accumulation: '#60a5fa',
                    distribution: '#f87171',
                  }}
                  formatYValue={formatCurrency}
                  tooltipFormatter={(value, name) => [formatCurrency(value), 'Projected Savings']}
                />
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold mb-4">Retirement Health</h3>
              <div className="flex flex-col items-center justify-center h-48 space-y-3">
                <span className="text-4xl">{healthStatus.icon}</span>
                <h4 className={`text-xl font-bold ${healthStatus.color}`}>{healthStatus.status}</h4>
                <p className="text-sm text-center text-gray-600">{healthStatus.description}</p>
              </div>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <h3 className="text-sm font-medium text-gray-500">Current Retirement Savings</h3>
              <p className="text-2xl font-bold mt-2">{formatCurrency(retirementPlan.currentSavings)}</p>
              <p className="text-xs text-gray-500 mt-1">Monthly contribution: {formatCurrency(retirementPlan.monthlySavings)}</p>
            </Card>
            
            <Card>
              <h3 className="text-sm font-medium text-gray-500">Projected at Retirement ({retirementPlan.retirementAge})</h3>
              <p className="text-2xl font-bold mt-2">{formatCurrency(retirementProjection.projectedSavingsAtRetirement)}</p>
              <p className="text-xs text-gray-500 mt-1">In {retirementProjection.yearsUntilRetirement} years</p>
            </Card>
            
            <Card>
              <h3 className="text-sm font-medium text-gray-500">Monthly Retirement Income</h3>
              <p className="text-2xl font-bold mt-2">{formatCurrency(retirementProjection.projectedMonthlyRetirementIncome)}</p>
              <p className="text-xs text-gray-500 mt-1">vs. Goal: {formatCurrency(retirementPlan.desiredRetirementIncome)}</p>
            </Card>
            
            <Card>
              <h3 className="text-sm font-medium text-gray-500">Retirement Savings Gap</h3>
              <p className="text-2xl font-bold mt-2 flex items-center">
                {retirementProjection.savingsGap <= 0 ? (
                  <span className="text-green-600">No Gap</span>
                ) : (
                  <span className="text-red-600">{formatCurrency(retirementProjection.savingsGap)}</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {retirementProjection.savingsGap > 0 
                  ? `Need additional ${formatCurrency(retirementProjection.monthlyContributionToReachGoal - retirementPlan.monthlySavings)}/mo`
                  : 'Your plan exceeds your goals'}
              </p>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Retirement Plan Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-sm text-gray-500">Expected Return</p>
                  <p className="font-medium">{formatPercentage(retirementPlan.expectedAnnualReturn)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Inflation Rate</p>
                  <p className="font-medium">{formatPercentage(retirementPlan.expectedInflationRate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Savings Run Out Age</p>
                  <p className="font-medium">
                    {retirementProjection.projectedSavingsRunsOutAge > retirementPlan.retirementAge
                      ? retirementProjection.projectedSavingsRunsOutAge
                      : 'During retirement'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Social Security</p>
                  <p className="font-medium">
                    {retirementPlan.includeSocialSecurity
                      ? formatCurrency(retirementPlan.estimatedSocialSecurityBenefit) + '/mo'
                      : 'Not included'}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold mb-4">Retirement Planning Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Consider maximizing tax-advantaged accounts like 401(k) and IRAs.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Review and rebalance your investment portfolio at least annually.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>As you approach retirement, gradually shift to more conservative investments.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Consider longevity risk in your planning; many people live longer than expected.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Plan for healthcare costs, which typically increase with age.</span>
                </li>
              </ul>
            </Card>
          </div>
        </>
      )}

      {/* Retirement Plan Edit Modal */}
      <Modal
        isOpen={showRetirementModal}
        onClose={() => setShowRetirementModal(false)}
        title="Retirement Plan Settings"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Current Age"
              id="currentAge"
              name="currentAge"
              type="number"
              value={retirementPlan.currentAge}
              onChange={handleInputChange}
              min="18"
              max="90"
            />
            
            <Input
              label="Retirement Age"
              id="retirementAge"
              name="retirementAge"
              type="number"
              value={retirementPlan.retirementAge}
              onChange={handleInputChange}
              min={retirementPlan.currentAge + 1}
              max="100"
            />
            
            <Input
              label="Life Expectancy"
              id="lifeExpectancy"
              name="lifeExpectancy"
              type="number"
              value={retirementPlan.lifeExpectancy}
              onChange={handleInputChange}
              min={retirementPlan.retirementAge + 1}
              max="120"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Current Retirement Savings"
              id="currentSavings"
              name="currentSavings"
              type="number"
              value={retirementPlan.currentSavings}
              onChange={handleInputChange}
              min="0"
              step="1000"
              prefix="$"
            />
            
            <Input
              label="Monthly Contribution"
              id="monthlySavings"
              name="monthlySavings"
              type="number"
              value={retirementPlan.monthlySavings}
              onChange={handleInputChange}
              min="0"
              step="50"
              prefix="$"
            />
          </div>
          
          <Input
            label="Desired Monthly Retirement Income"
            id="desiredRetirementIncome"
            name="desiredRetirementIncome"
            type="number"
            value={retirementPlan.desiredRetirementIncome}
            onChange={handleInputChange}
            min="0"
            step="100"
            prefix="$"
            helperText="How much monthly income do you want in retirement?"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Expected Annual Return (%)"
              id="expectedAnnualReturn"
              name="expectedAnnualReturn"
              type="number"
              value={retirementPlan.expectedAnnualReturn}
              onChange={handleInputChange}
              min="0"
              max="20"
              step="0.1"
              suffix="%"
              helperText="Expected return on investments before retirement"
            />
            
            <Input
              label="Expected Inflation Rate (%)"
              id="expectedInflationRate"
              name="expectedInflationRate"
              type="number"
              value={retirementPlan.expectedInflationRate}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
              suffix="%"
            />
          </div>
          
          <Toggle
            label="Adjust for Inflation"
            id="adjustForInflation"
            name="adjustForInflation"
            checked={retirementPlan.adjustForInflation}
            onChange={handleInputChange}
            helperText="Account for inflation in projections"
          />
          
          <Toggle
            label="Include Social Security"
            id="includeSocialSecurity"
            name="includeSocialSecurity"
            checked={retirementPlan.includeSocialSecurity}
            onChange={handleInputChange}
          />
          
          {retirementPlan.includeSocialSecurity && (
            <Input
              label="Estimated Monthly Social Security Benefit"
              id="estimatedSocialSecurityBenefit"
              name="estimatedSocialSecurityBenefit"
              type="number"
              value={retirementPlan.estimatedSocialSecurityBenefit}
              onChange={handleInputChange}
              min="0"
              step="100"
              prefix="$"
              helperText="Estimate from ssa.gov or based on your earnings history"
            />
          )}
          
          <Toggle
            label="Include Additional Retirement Income"
            id="includeAdditionalIncome"
            name="includeAdditionalIncome"
            checked={retirementPlan.includeAdditionalIncome}
            onChange={handleInputChange}
            helperText="Such as pension, part-time work, rental income, etc."
          />
          
          {retirementPlan.includeAdditionalIncome && (
            <>
              <Input
                label="Additional Monthly Income Amount"
                id="additionalIncomeAmount"
                name="additionalIncomeAmount"
                type="number"
                value={retirementPlan.additionalIncomeAmount}
                onChange={handleInputChange}
                min="0"
                step="100"
                prefix="$"
              />
              
              <Input
                label="Income Source Description"
                id="additionalIncomeDescription"
                name="additionalIncomeDescription"
                value={retirementPlan.additionalIncomeDescription}
                onChange={handleInputChange}
                placeholder="E.g., Pension, rental income, part-time work"
              />
            </>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRetirementModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveRetirementPlan}
            >
              Save Retirement Plan
            </Button>
          </div>
        </form>
      </Modal>

      {/* AI Recommendations Modal */}
      <Modal
        isOpen={showRecommendationsModal}
        onClose={() => setShowRecommendationsModal(false)}
        title="AI Retirement Recommendations"
        size="lg"
      >
        {recommendations ? (
          <div className="space-y-4">
            <p className="text-gray-700">{recommendations.summary}</p>
            
            <h3 className="font-semibold text-lg mt-4">Personalized Recommendations</h3>
            <ul className="space-y-3">
              {recommendations.recommendations.map((rec, index) => (
                <li key={index} className="bg-blue-50 p-3 rounded-md">
                  <h4 className="font-medium text-blue-800">{rec.title}</h4>
                  <p className="text-sm text-gray-700 mt-1">{rec.description}</p>
                </li>
              ))}
            </ul>
            
            {recommendations.adjustments && (
              <>
                <h3 className="font-semibold text-lg mt-4">Suggested Adjustments</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <ul className="space-y-2">
                    {recommendations.adjustments.map((adj, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>{adj.label}:</span>
                        <span className="font-medium">{adj.currentValue} → {adj.suggestedValue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowRecommendationsModal(false)}>Close</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <Spinner size="lg" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RetirementPlanner;  