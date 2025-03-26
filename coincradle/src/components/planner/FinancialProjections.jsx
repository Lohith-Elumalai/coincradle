import React, { useState, useEffect } from 'react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { useAI } from '../../hooks/useAI';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Toggle from '../common/Toggle';
import Select from '../common/Select';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import LineChart from '../ui/LineChart';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const FinancialProjections = () => {
  const { userFinancialData, updateUserFinancialData } = useFinanceData();
  const { getFinancialProjections, isLoading } = useAI();
  const [projectionSettings, setProjectionSettings] = useState({
    projectionYears: userFinancialData?.financialProjections?.projectionYears || 10,
    incomeGrowthRate: userFinancialData?.financialProjections?.incomeGrowthRate || 3,
    expenseGrowthRate: userFinancialData?.financialProjections?.expenseGrowthRate || 2.5,
    savingsRate: userFinancialData?.financialProjections?.savingsRate || 20,
    investmentReturnRate: userFinancialData?.financialProjections?.investmentReturnRate || 7,
    inflationRate: userFinancialData?.financialProjections?.inflationRate || 2.5,
    includeInvestments: userFinancialData?.financialProjections?.includeInvestments || true,
    includeDebt: userFinancialData?.financialProjections?.includeDebt || true,
    includeRetirement: userFinancialData?.financialProjections?.includeRetirement || true,
    includeInflation: userFinancialData?.financialProjections?.includeInflation || true,
    majorLifeEvents: userFinancialData?.financialProjections?.majorLifeEvents || [],
    scenarios: userFinancialData?.financialProjections?.scenarios || ['baseline', 'optimistic', 'pessimistic'],
    selectedScenario: userFinancialData?.financialProjections?.selectedScenario || 'baseline',
  });

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAIInsights] = useState(null);
  const [projectionData, setProjectionData] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    year: 1,
    type: 'expense',
    amount: '',
    recurring: false,
    recurringAmount: '',
    recurringPeriod: 'yearly',
    description: '',
  });

  // Initialize projections on component mount
  useEffect(() => {
    if (userFinancialData) {
      calculateProjections();
    }
  }, [userFinancialData]);
  
  useEffect(() => {
    // Reset form when modal closes
    if (!showEventModal) {
      setNewEvent({
        title: '',
        year: 1,
        type: 'expense',
        amount: '',
        recurring: false,
        recurringAmount: '',
        recurringPeriod: 'yearly',
        description: '',
      });
      setEditingEvent(null);
    }
  }, [showEventModal]);

  // Set form when editing event
  useEffect(() => {
    if (editingEvent) {
      setNewEvent({
        ...editingEvent,
        amount: editingEvent.amount.toString(),
        recurringAmount: editingEvent.recurringAmount?.toString() || '',
      });
      setShowEventModal(true);
    }
  }, [editingEvent]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setProjectionSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleEventInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setNewEvent((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'year' ? parseInt(value) : value,
    }));
  };

  const saveProjectionSettings = () => {
    const updatedData = {
      ...userFinancialData,
      financialProjections: projectionSettings
    };
    
    updateUserFinancialData(updatedData);
    setShowSettingsModal(false);
    calculateProjections();
  };

  const saveLifeEvent = () => {
    const formattedEvent = {
      ...newEvent,
      amount: parseFloat(newEvent.amount),
      recurringAmount: newEvent.recurring ? parseFloat(newEvent.recurringAmount) : 0,
      id: editingEvent ? editingEvent.id : Date.now().toString(),
    };

    let updatedEvents;
    if (editingEvent) {
      updatedEvents = projectionSettings.majorLifeEvents.map(event => 
        event.id === editingEvent.id ? formattedEvent : event
      );
    } else {
      updatedEvents = [...projectionSettings.majorLifeEvents, formattedEvent];
    }

    setProjectionSettings(prev => ({
      ...prev,
      majorLifeEvents: updatedEvents
    }));

    setShowEventModal(false);
  };

  const deleteLifeEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = projectionSettings.majorLifeEvents.filter(event => event.id !== id);
      
      setProjectionSettings(prev => ({
        ...prev,
        majorLifeEvents: updatedEvents
      }));
    }
  };

  const calculateProjections = () => {
    if (!userFinancialData) return;

    const { 
      projectionYears, 
      incomeGrowthRate, 
      expenseGrowthRate, 
      savingsRate, 
      investmentReturnRate, 
      inflationRate,
      includeInvestments,
      includeDebt,
      includeRetirement,
      includeInflation,
      majorLifeEvents,
      selectedScenario
    } = projectionSettings;

    // Get current financial situation
    const currentIncome = userFinancialData.monthlyIncome || 5000;
    const currentExpenses = userFinancialData.monthlyExpenses || 4000;
    const currentSavings = userFinancialData.totalSavings || 10000;
    const currentInvestments = userFinancialData.totalInvestments || 20000;
    const currentDebt = userFinancialData.totalDebt || 15000;
    const monthlySavingsAmount = (currentIncome * (savingsRate / 100));

    // Adjust rates for different scenarios
    let adjustedRates = {
      income: incomeGrowthRate / 100,
      expense: expenseGrowthRate / 100,
      investment: investmentReturnRate / 100,
      inflation: inflationRate / 100
    };

    if (selectedScenario === 'optimistic') {
      adjustedRates = {
        income: (incomeGrowthRate + 2) / 100,
        expense: expenseGrowthRate / 100,
        investment: (investmentReturnRate + 3) / 100,
        inflation: inflationRate / 100
      };
    } else if (selectedScenario === 'pessimistic') {
      adjustedRates = {
        income: Math.max(0, (incomeGrowthRate - 2) / 100),
        expense: (expenseGrowthRate + 1) / 100,
        investment: Math.max(0, (investmentReturnRate - 3) / 100),
        inflation: (inflationRate + 1) / 100
      };
    }

    // Generate projection data
    const projectionData = [];
    let currentYear = new Date().getFullYear();
    
    // Starting values
    let runningIncome = currentIncome * 12;
    let runningExpenses = currentExpenses * 12;
    let runningSavings = currentSavings;
    let runningInvestments = currentInvestments;
    let runningDebt = currentDebt;
    let runningNetWorth = runningSavings + runningInvestments - runningDebt;
    let inflationFactor = 1;

    for (let year = 0; year <= projectionYears; year++) {
      // Process life events for the current year
      const yearEvents = majorLifeEvents.filter(event => parseInt(event.year) === year);
      
      let yearlyEventImpact = 0;
      let yearlyRecurringImpact = 0;
      
      yearEvents.forEach(event => {
        if (event.type === 'income') {
          yearlyEventImpact += parseFloat(event.amount);
        } else if (event.type === 'expense') {
          yearlyEventImpact -= parseFloat(event.amount);
        }
        
        // Add recurring impact
        if (event.recurring) {
          if (event.type === 'income') {
            yearlyRecurringImpact += parseFloat(event.recurringAmount);
          } else if (event.type === 'expense') {
            yearlyRecurringImpact -= parseFloat(event.recurringAmount);
          }
        }
      });
      
      // Ongoing recurring impacts from previous years
      const previousRecurringEvents = majorLifeEvents.filter(
        event => event.recurring && parseInt(event.year) < year
      );
      
      previousRecurringEvents.forEach(event => {
        if (event.type === 'income') {
          yearlyRecurringImpact += parseFloat(event.recurringAmount);
        } else if (event.type === 'expense') {
          yearlyRecurringImpact -= parseFloat(event.recurringAmount);
        }
      });

      // Calculate yearly savings
      const yearlySavings = (monthlySavingsAmount * 12) + yearlyRecurringImpact;
      
      // Update running totals
      if (year > 0) {
        // Apply growth rates 
        inflationFactor = includeInflation ? inflationFactor * (1 + adjustedRates.inflation) : 1;
        runningIncome = runningIncome * (1 + adjustedRates.income);
        runningExpenses = runningExpenses * (1 + adjustedRates.expense);
        
        // Update investments
        if (includeInvestments) {
          runningInvestments = runningInvestments * (1 + adjustedRates.investment) + (yearlySavings * 0.7);
        }
        
        // Update savings
        runningSavings = runningSavings + (yearlySavings * 0.3) + yearlyEventImpact;
        
        // Update debt
        if (includeDebt && runningDebt > 0) {
          // Assume 15% of savings goes to extra debt payments
          const debtPayment = yearlySavings * 0.15;
          runningDebt = Math.max(0, runningDebt - debtPayment);
        }
      }
      
      // Calculate net worth
      runningNetWorth = runningSavings + runningInvestments - runningDebt;
      
      // Calculate real (inflation-adjusted) values
      const realNetWorth = runningNetWorth / inflationFactor;
      const realIncome = runningIncome / inflationFactor;
      const realExpenses = runningExpenses / inflationFactor;

      projectionData.push({
        year: currentYear + year,
        yearIndex: year,
        income: runningIncome,
        expenses: runningExpenses,
        savings: runningSavings,
        investments: runningInvestments,
        debt: runningDebt,
        netWorth: runningNetWorth,
        realNetWorth: realNetWorth,
        realIncome: realIncome,
        realExpenses: realExpenses,
        events: yearEvents,
        inflationFactor: inflationFactor
      });
    }

    setProjectionData(projectionData);
  };

  const getAIInsights = async () => {
    try {
      const insights = await getFinancialProjections({
        projectionSettings,
        projectionData,
        userFinancialData,
      });
      
      setAIInsights(insights);
      setShowAIInsights(true);
    } catch (error) {
      console.error('Error getting AI insights:', error);
    }
  };

  const getEventType = (type) => {
    switch (type) {
      case 'income':
        return { label: 'Income', icon: '💰', color: 'bg-green-100 text-green-800' };
      case 'expense':
        return { label: 'Expense', icon: '💸', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Event', icon: '📅', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getScenarioLabel = (scenario) => {
    switch (scenario) {
      case 'baseline':
        return 'Baseline Projection';
      case 'optimistic':
        return 'Optimistic Scenario';
      case 'pessimistic':
        return 'Pessimistic Scenario';
      default:
        return scenario;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Financial Projections</h2>
        <div className="flex space-x-3">
          <Select
            id="selectedScenario"
            name="selectedScenario"
            value={projectionSettings.selectedScenario}
            onChange={handleInputChange}
            className="w-40"
            options={projectionSettings.scenarios.map(scenario => ({
              value: scenario,
              label: getScenarioLabel(scenario)
            }))}
          />
          <Button 
            variant="outline"
            onClick={() => setShowSettingsModal(true)}
          >
            Projection Settings
          </Button>
          <Button onClick={getAIInsights} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Get AI Insights'}
          </Button>
        </div>
      </div>

      {!projectionData ? (
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No projections available</h3>
            <p className="text-gray-500 mb-4">Set up your financial projections to see future scenarios.</p>
            <Button onClick={() => setShowSettingsModal(true)}>Configure Projections</Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Net Worth Projection Chart */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Net Worth Projection</h3>
              <div className="flex items-center text-sm">
                <Toggle
                  id="includeInflation"
                  name="includeInflation"
                  checked={projectionSettings.includeInflation}
                  onChange={handleInputChange}
                  label="Adjust for Inflation"
                  inline={true}
                />
              </div>
            </div>
            <div className="h-72">
              <LineChart 
                data={projectionData}
                xKey="yearIndex"
                yKey={projectionSettings.includeInflation ? "realNetWorth" : "netWorth"}
                xLabel="Year"
                yLabel="Net Worth"
                colorClass="stroke-blue-500"
                formatXValue={(value) => new Date().getFullYear() + value}
                formatYValue={formatCurrency}
                tooltipFormatter={(value, name) => [formatCurrency(value), 'Net Worth']}
              />
            </div>
          </Card>

          {/* Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Income & Expenses</h3>
              <div className="h-56">
                <LineChart 
                  data={projectionData}
                  xKey="yearIndex"
                  multipleYKeys={[
                    {key: projectionSettings.includeInflation ? "realIncome" : "income", name: "Income", color: "#22c55e"},
                    {key: projectionSettings.includeInflation ? "realExpenses" : "expenses", name: "Expenses", color: "#ef4444"}
                  ]}
                  xLabel="Year"
                  yLabel="Amount"
                  formatXValue={(value) => new Date().getFullYear() + value}
                  formatYValue={formatCurrency}
                />
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold mb-4">Assets Breakdown</h3>
              <div className="h-56">
                <LineChart 
                  data={projectionData}
                  xKey="yearIndex"
                  multipleYKeys={[
                    {key: "savings", name: "Savings", color: "#3b82f6"},
                    {key: "investments", name: "Investments", color: "#8b5cf6"}
                  ]}
                  xLabel="Year"
                  yLabel="Amount"
                  formatXValue={(value) => new Date().getFullYear() + value}
                  formatYValue={formatCurrency}
                />
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold mb-4">Debt Reduction</h3>
              <div className="h-56">
                <LineChart 
                  data={projectionData}
                  xKey="yearIndex"
                  yKey="debt"
                  xLabel="Year"
                  yLabel="Debt"
                  colorClass="stroke-red-500"
                  formatXValue={(value) => new Date().getFullYear() + value}
                  formatYValue={formatCurrency}
                />
              </div>
            </Card>
          </div>

          {/* Projection Summary */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Projection Summary</h3>
              <p className="text-sm text-gray-500">
                {getScenarioLabel(projectionSettings.selectedScenario)} ({projectionSettings.projectionYears} years)
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investments</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debt</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectionData.map((data, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{data.year}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(projectionSettings.includeInflation ? data.realNetWorth : data.netWorth)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(projectionSettings.includeInflation ? data.realIncome : data.income)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(projectionSettings.includeInflation ? data.realExpenses : data.expenses)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(data.savings)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(data.investments)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(data.debt)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        {data.events.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {data.events.map((event) => {
                              const eventType = getEventType(event.type);
                              return (
                                <span 
                                  key={event.id} 
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${eventType.color}`}
                                  title={event.title}
                                >
                                  {eventType.icon} {event.title.length > 10 ? `${event.title.substring(0, 10)}...` : event.title}
                                </span>
                              );
                            })}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Life Events */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Major Life Events</h3>
              <Button onClick={() => setShowEventModal(true)}>Add Life Event</Button>
            </div>
            
            {projectionSettings.majorLifeEvents.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No major life events added yet.</p>
                <p className="text-sm text-gray-400 mt-1">Add events like home purchase, career change, or education expenses.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projectionSettings.majorLifeEvents
                  .sort((a, b) => a.year - b.year)
                  .map((event) => {
                    const eventType = getEventType(event.type);
                    const yearLabel = `Year ${event.year} (${new Date().getFullYear() + parseInt(event.year)})`;
                    
                    return (
                      <div key={event.id} className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="mb-2 sm:mb-0">
                          <div className="flex items-center">
                            <span className="mr-2">{eventType.icon}</span>
                            <span className="font-medium">{event.title}</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${eventType.color}`}>
                              {eventType.label}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1">
                            <span>{yearLabel}</span>
                            <span className="hidden sm:block mx-2">•</span>
                            <span>{formatCurrency(event.amount)}</span>
                            {event.recurring && (
                              <>
                                <span className="hidden sm:block mx-2">•</span>
                                <span>Recurring: {formatCurrency(event.recurringAmount)} {event.recurringPeriod}</span>
                              </>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingEvent(event)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteLifeEvent(event.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </Card>
        </>
      )}

      {/* Projection Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Financial Projection Settings"
      >
        <form className="space-y-4">
          <Input
            label="Projection Years"
            id="projectionYears"
            name="projectionYears"
            type="number"
            value={projectionSettings.projectionYears}
            onChange={handleInputChange}
            min="1"
            max="50"
            helperText="Number of years to project into the future"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Income Growth Rate (%)"
              id="incomeGrowthRate"
              name="incomeGrowthRate"
              type="number"
              value={projectionSettings.incomeGrowthRate}
              onChange={handleInputChange}
              min="0"
              max="20"
              step="0.1"
              suffix="%"
              helperText="Annual increase in income"
            />
            
            <Input
              label="Expense Growth Rate (%)"
              id="expenseGrowthRate"
              name="expenseGrowthRate"
              type="number"
              value={projectionSettings.expenseGrowthRate}
              onChange={handleInputChange}
              min="0"
              max="20"
              step="0.1"
              suffix="%"
              helperText="Annual increase in expenses"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Savings Rate (%)"
              id="savingsRate"
              name="savingsRate"
              type="number"
              value={projectionSettings.savingsRate}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="1"
              suffix="%"
              helperText="Percentage of income saved"
            />
            
            <Input
              label="Investment Return Rate (%)"
              id="investmentReturnRate"
              name="investmentReturnRate"
              type="number"
              value={projectionSettings.investmentReturnRate}
              onChange={handleInputChange}
              min="0"
              max="20"
              step="0.1"
              suffix="%"
              helperText="Expected annual return on investments"
            />
          </div>
          
          <Input
            label="Inflation Rate (%)"
            id="inflationRate"
            name="inflationRate"
            type="number"
            value={projectionSettings.inflationRate}
            onChange={handleInputChange}
            min="0"
            max="10"
            step="0.1"
            suffix="%"
            helperText="Expected annual inflation rate"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toggle
              label="Include Investments"
              id="includeInvestments"
              name="includeInvestments"
              checked={projectionSettings.includeInvestments}
              onChange={handleInputChange}
              helperText="Include investment growth in projections"
            />
            
            <Toggle
              label="Include Debt"
              id="includeDebt"
              name="includeDebt"
              checked={projectionSettings.includeDebt}
              onChange={handleInputChange}
              helperText="Include debt repayment in projections"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toggle
              label="Include Retirement Savings"
              id="includeRetirement"
              name="includeRetirement"
              checked={projectionSettings.includeRetirement}
              onChange={handleInputChange}
              helperText="Include retirement accounts in projections"
            />
            
            <Toggle
              label="Adjust for Inflation"
              id="includeInflation"
              name="includeInflation"
              checked={projectionSettings.includeInflation}
              onChange={handleInputChange}
              helperText="Show values adjusted for inflation"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSettingsModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveProjectionSettings}
            >
              Save Settings
            </Button>
          </div>
        </form>
      </Modal>

      {/* Life Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title={editingEvent ? "Edit Life Event" : "Add Life Event"}
      >
        <form className="space-y-4">
          <Input
            label="Event Title"
            id="title"
            name="title"
            value={newEvent.title}
            onChange={handleEventInputChange}
            placeholder="e.g., Home Purchase, College Tuition, Career Change"
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Year"
              id="year"
              name="year"
              type="number"
              value={newEvent.year}
              onChange={handleEventInputChange}
              min="0"
              max={projectionSettings.projectionYears}
              helperText={`Year from now (${new Date().getFullYear() + parseInt(newEvent.year)})`}
              required
            />
            
            <Select
              label="Event Type"
              id="type"
              name="type"
              value={newEvent.type}
              onChange={handleEventInputChange}
              options={[
                { value: 'income', label: '💰 Income' },
                { value: 'expense', label: '💸 Expense' },
              ]}
              required
            />
          </div>
          
          <Input
            label={`Event ${newEvent.type === 'income' ? 'Income' : 'Cost'}`}
            id="amount"
            name="amount"
            type="number"
            value={newEvent.amount}
            onChange={handleEventInputChange}
            min="0"
            step="100"
            prefix="$"
            required
          />
          
          <Toggle
            label="Has Recurring Impact"
            id="recurring"
            name="recurring"
            checked={newEvent.recurring}
            onChange={handleEventInputChange}
            helperText="Does this event have ongoing financial impact?"
          />
          
          {newEvent.recurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={`Recurring ${newEvent.type === 'income' ? 'Income' : 'Cost'}`}
                id="recurringAmount"
                name="recurringAmount"
                type="number"
                value={newEvent.recurringAmount}
                onChange={handleEventInputChange}
                min="0"
                step="100"
                prefix="$"
                required
              />
              
              <Select
                label="Recurring Period"
                id="recurringPeriod"
                name="recurringPeriod"
                value={newEvent.recurringPeriod}
                onChange={handleEventInputChange}
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'yearly', label: 'Yearly' },
                ]}
              />
            </div>
          )}
          
          <Input
            label="Description"
            id="description"
            name="description"
            type="textarea"
            value={newEvent.description}
            onChange={handleEventInputChange}
            placeholder="Additional details about this life event"
            rows={3}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEventModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveLifeEvent}
            >
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* AI Insights Modal */}
      <Modal
        isOpen={showAIInsights}
        onClose={() => setShowAIInsights(false)}
        title="AI Financial Insights"
        size="lg"
      >
        {aiInsights ? (
          <div className="space-y-4">
            <p className="text-gray-700">{aiInsights.summary}</p>
            
            <h3 className="font-semibold text-lg mt-4">Key Observations</h3>
            <ul className="space-y-2">
              {aiInsights.observations.map((observation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{observation}</span>
                </li>
              ))}
            </ul>
            
            <h3 className="font-semibold text-lg mt-4">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-800">{recommendation.title}</h4>
                  <p className="text-sm text-gray-700 mt-2">{recommendation.description}</p>
                </div>
              ))}
            </div>
            
            {aiInsights.risksAndOpportunities && (
              <>
                <h3 className="font-semibold text-lg mt-4">Risks & Opportunities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="font-medium text-red-800">Potential Risks</h4>
                    <ul className="mt-2 space-y-1">
                      {aiInsights.risksAndOpportunities.risks.map((risk, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md">
                    <h4 className="font-medium text-green-800">Opportunities</h4>
                    <ul className="mt-2 space-y-1">
                      {aiInsights.risksAndOpportunities.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span>{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowAIInsights(false)}>Close</Button>
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

export default FinancialProjections;
