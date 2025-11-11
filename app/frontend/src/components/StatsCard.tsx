import React from 'react';

interface Props {
  label: string;
  value: string | number;
  trend?: string;
}

const StatsCard: React.FC<Props> = ({ label, value, trend }) => (
  <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-100">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-brand">{value}</p>
    {trend && <p className="text-xs text-emerald-500 mt-1">{trend}</p>}
  </div>
);

export default StatsCard;
