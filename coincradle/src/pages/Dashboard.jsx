import { useContext } from 'react';
import { FinanceDataContext } from '../contexts/FinanceDataContext';
import { ProtectedRoute } from '../components/guards/ProtectedRoute';
import FinancialOverview from '../components/dashboard/FinancialOverview';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingInsights from '../components/dashboard/SpendingInsights';
import GoalProgress from '../components/dashboard/GoalProgress';

const Dashboard = () => {
  const { transactions, insights, goals } = useContext(FinanceDataContext);

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="col-span-4">
          <FinancialOverview />
        </div>
        <div className="col-span-4 md:col-span-2">
          <SpendingInsights data={insights} />
        </div>
        <div className="col-span-4 md:col-span-2">
          <GoalProgress goals={goals} />
        </div>
        <div className="col-span-4">
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;