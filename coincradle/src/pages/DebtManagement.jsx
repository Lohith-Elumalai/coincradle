import { useContext } from 'react';
import { FinanceDataContext } from '../contexts/FinanceDataContext';
import DebtOverview from '../components/debt/DebtOverview';
import PaymentPlan from '../components/debt/PaymentPlan';
import CreditScore from '../components/debt/CreditScore';

const DebtManagement = () => {
  const { debts, creditScore } = useContext(FinanceDataContext);

  return (
    <div className="p-4 space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <DebtOverview debts={debts} />
        <CreditScore score={creditScore} />
      </div>
      <PaymentPlan debts={debts} />
    </div>
  );
};

export default DebtManagement;