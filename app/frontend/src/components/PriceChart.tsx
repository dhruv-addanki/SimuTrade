import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
  data: { time: string; value: number }[];
}

const PriceChart: React.FC<Props> = ({ data }) => (
  <div className="bg-white rounded-lg p-4 shadow border border-slate-100 h-64">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" stroke="#94a3b8" hide />
        <YAxis stroke="#94a3b8" hide />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default PriceChart;
