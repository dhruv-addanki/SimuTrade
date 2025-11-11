import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface PortfolioSummary {
  total_value: string;
  cash: string;
  holdings_value: string;
  total_pnl: string;
}

export interface Holding {
  id: number;
  asset: number;
  quantity: number;
  avg_cost_basis: string;
  market_value: string;
  asset_detail?: {
    symbol: string;
  };
}

export const usePortfolio = () => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const [summaryRes, holdingsRes] = await Promise.all([
        api.get('/portfolio/summary'),
        api.get('/portfolio/holdings'),
      ]);
      setSummary(summaryRes.data);
      setHoldings(holdingsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { summary, holdings, loading, refresh };
};
