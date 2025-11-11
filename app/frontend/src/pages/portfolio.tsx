import HoldingsTable from '../components/HoldingsTable';
import StatsCard from '../components/StatsCard';
import { usePortfolio } from '../hooks/usePortfolio';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface PnlResponse {
  realized_pnl: string;
  unrealized_pnl: string;
  total_pnl: string;
}

export default function PortfolioPage() {
  const { summary, holdings } = usePortfolio();
  const [pnl, setPnl] = useState<PnlResponse | null>(null);

  useEffect(() => {
    const fetchPnl = async () => {
      const { data } = await api.get('/portfolio/pnl');
      setPnl(data);
    };
    fetchPnl();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard label="Realized PnL" value={`$${Number(pnl?.realized_pnl || 0).toFixed(2)}`} />
        <StatsCard label="Unrealized PnL" value={`$${Number(pnl?.unrealized_pnl || 0).toFixed(2)}`} />
        <StatsCard label="Total PnL" value={`$${Number(pnl?.total_pnl || 0).toFixed(2)}`} />
      </div>
      <div className="bg-white rounded-lg p-4 shadow border border-slate-100">
        <p className="text-sm text-slate-500">Portfolio Value</p>
        <h3 className="text-3xl font-semibold text-brand">${Number(summary?.total_value || 0).toLocaleString()}</h3>
      </div>
      <HoldingsTable holdings={holdings} />
    </div>
  );
}
