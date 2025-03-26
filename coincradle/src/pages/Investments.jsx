import { useContext } from 'react';
import { FinanceDataContext } from '../contexts/FinanceDataContext';
import InvestmentPortfolio from '../components/investments/InvestmentPortfolio';
import InvestmentRecommendations from '../components/investments/InvestmentRecommendations';

const Investments = () => {
  const { portfolio, recommendations } = useContext(FinanceDataContext);

  return (
    <div className="p-4 grid md:grid-cols-2 gap-4">
      <InvestmentPortfolio portfolio={portfolio} />
      <InvestmentRecommendations recommendations={recommendations} />
    </div>
  );
};

export default Investments;