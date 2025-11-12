import React from 'react';

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  trend?: {
    label: string;
    isPositive?: boolean;
  };
}

const StatsCard: React.FC<Props> = ({ label, value, hint, trend }) => (
  <div className="glass-panel flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase tracking-[0.3em] text-white/60">{label}</p>
      {hint && <span className="pill bg-white/5 text-white/60">{hint}</span>}
    </div>
    <p className="font-display text-3xl font-semibold text-white">{value}</p>
    {trend && (
      <div
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
          trend.isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
        }`}
      >
        <span>{trend.isPositive ? '▲' : '▼'}</span>
        <span>{trend.label}</span>
      </div>
    )}
  </div>
);

export default StatsCard;
