import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
  data: { time: string; value: number }[];
}

const PriceChart: React.FC<Props> = ({ data }) => (
  <div className="glass-panel h-72">
    <div className="flex items-center justify-between pb-4">
      <div>
        <p className="panel-heading">Equity Curve</p>
        <p className="text-lg font-semibold text-white">Last 14 sessions</p>
      </div>
      <span className="pill bg-emerald-500/20 text-emerald-300">Live</span>
    </div>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <Tooltip
          contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '12px' }}
          itemStyle={{ color: '#38bdf8' }}
        />
        <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default PriceChart;
