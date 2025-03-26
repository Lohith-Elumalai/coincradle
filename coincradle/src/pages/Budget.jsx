import { useContext } from 'react';
import { FinanceDataContext } from '../contexts/FinanceDataContext';
import BudgetOverview from '../components/budget/BudgetOverview';
import CategoryBreakdown from '../components/budget/CategoryBreakdown';
import BudgetForm from '../components/budget/BudgetForm';

const Budget = () => {
  const { budget } = useContext(FinanceDataContext);

  return (
    <div className="p-4 space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <BudgetOverview budget={budget} />
        <CategoryBreakdown budget={budget} />
      </div>
      <BudgetForm />
    </div>
  );
};

export default Budget;