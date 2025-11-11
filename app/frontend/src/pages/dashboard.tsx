import { useMemo } from 'react';
import PriceChart from '../components/PriceChart';
import StatsCard from '../components/StatsCard';
import HoldingsTable from '../components/HoldingsTable';
import { usePortfolio } from '../hooks/usePortfolio';

export default function DashboardPage() {
  const { summary, holdings } = usePortfolio();

  const chartData = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, idx) => ({
        time: `D${idx + 1}`,
        value: summary ? Number(summary.total_value) * (0.98 + Math.random() * 0.04) : 0,
      })),
    [summary]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard label="Portfolio Value" value={`$${Number(summary?.total_value || 0).toLocaleString()}`} />
        <StatsCard label="Cash" value={`$${Number(summary?.cash || 0).toLocaleString()}`} />
        <StatsCard label="Holdings" value={`$${Number(summary?.holdings_value || 0).toLocaleString()}`} />
        <StatsCard label="Total PnL" value={`$${Number(summary?.total_pnl || 0).toLocaleString()}`} />
      </div>
      <PriceChart data={chartData} />
      <div>
        <h3 className="text-lg font-semibold text-brand mb-3">Holdings</h3>
        <HoldingsTable holdings={holdings} />
      </div>
    </div>
  );
}
