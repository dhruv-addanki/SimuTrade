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
  const realized = Number(pnl?.realized_pnl || 0);
  const unrealized = Number(pnl?.unrealized_pnl || 0);
  const total = Number(pnl?.total_pnl || 0);

  useEffect(() => {
    const fetchPnl = async () => {
      const { data } = await api.get('/portfolio/pnl');
      setPnl(data);
    };
    fetchPnl();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="panel-heading">Portfolio</p>
        <h1 className="font-display text-3xl font-semibold text-white">Positions & exposure</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          label="Realized PnL"
          value={`$${realized.toFixed(2)}`}
          hint="Closed trades"
          trend={{ label: realized >= 0 ? 'winning' : 'lagging', isPositive: realized >= 0 }}
        />
        <StatsCard
          label="Unrealized PnL"
          value={`$${unrealized.toFixed(2)}`}
          hint="Open risk"
        />
        <StatsCard
          label="Total PnL"
          value={`$${total.toFixed(2)}`}
          hint="Since inception"
          trend={{ label: total >= 0 ? 'ahead' : 'behind', isPositive: total >= 0 }}
        />
      </div>

      <div className="glass-panel">
        <p className="panel-heading">Portfolio Value</p>
        <div className="mt-2 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h3 className="font-display text-4xl font-semibold text-white">
            ${Number(summary?.total_value || 0).toLocaleString()}
          </h3>
          <div className="flex gap-4 text-sm text-white/70">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Cash</p>
              <p className="font-semibold text-white">
                ${Number(summary?.cash || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Invested</p>
              <p className="font-semibold text-white">
                ${Number(summary?.holdings_value || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <HoldingsTable holdings={holdings} />
    </div>
  );
}
