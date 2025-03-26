import { useContext, useState } from 'react';
import { FinanceDataContext } from '../contexts/FinanceDataContext';
import GoalSetting from '../components/planner/GoalSetting';
import RetirementPlanner from '../components/planner/RetirementPlanner';

const FinancialPlanning = () => {
  const { goals } = useContext(FinanceDataContext);
  const [activeTab, setActiveTab] = useState('goals');

  return (
    <div className="p-4 space-y-4">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'goals' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>
        <button
          className={`tab ${activeTab === 'retirement' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('retirement')}
        >
          Retirement
        </button>
      </div>
      
      {activeTab === 'goals' && <GoalSetting goals={goals} />}
      {activeTab === 'retirement' && <RetirementPlanner />}
    </div>
  );
};

export default FinancialPlanning;