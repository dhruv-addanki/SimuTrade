import { useMemo } from 'react';
import PriceChart from '../components/PriceChart';
import StatsCard from '../components/StatsCard';
import HoldingsTable from '../components/HoldingsTable';
import { usePortfolio } from '../hooks/usePortfolio';

const actions = ['Deposit Funds', 'Withdraw', 'Place Order', 'Export Report'];

export default function DashboardPage() {
  const { summary, holdings } = usePortfolio();
  const totalPnl = Number(summary?.total_pnl || 0);
  const pnlIsPositive = totalPnl >= 0;

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
      <div>
        <p className="panel-heading">Overview</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-white">Morning briefing</h1>
            <p className="text-white/60">Track performance, price momentum, and open orders in one canvas.</p>
          </div>
          <span className="pill bg-white/10 text-white/70">Beta workspace</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Portfolio Value"
          value={`$${Number(summary?.total_value || 0).toLocaleString()}`}
          hint="Total balance"
          trend={{ label: '+1.8% today', isPositive: true }}
        />
        <StatsCard
          label="Cash Available"
          value={`$${Number(summary?.cash || 0).toLocaleString()}`}
          hint="Ready to deploy"
        />
        <StatsCard
          label="Holdings"
          value={`$${Number(summary?.holdings_value || 0).toLocaleString()}`}
          hint={`${holdings.length} symbols`}
        />
        <StatsCard
          label="Total PnL"
          value={`$${totalPnl.toLocaleString()}`}
          trend={{ label: pnlIsPositive ? 'on target' : 'review', isPositive: pnlIsPositive }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PriceChart data={chartData} />
        </div>
        <div className="glass-panel flex flex-col gap-4">
          <div>
            <p className="panel-heading">Quick Actions</p>
            <p className="text-lg font-semibold text-white">Execute in two taps</p>
          </div>
          <div className="space-y-3">
            {actions.map((action) => (
              <button
                key={action}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white/80 transition hover:border-brand-accent hover:text-white"
              >
                {action}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/50">Automations coming soon · 24/7 simulated execution.</p>
        </div>
      </div>

      <HoldingsTable holdings={holdings} />
    </div>
  );
}
