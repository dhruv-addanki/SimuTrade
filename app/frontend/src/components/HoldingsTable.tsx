import React from 'react';
import { Holding } from '../hooks/usePortfolio';

interface Props {
  holdings: Holding[];
}

const HoldingsTable: React.FC<Props> = ({ holdings }) => (
  <div className="bg-white rounded-lg shadow border border-slate-100">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Symbol</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Quantity</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Avg Cost</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Market Value</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {holdings.map((holding) => (
          <tr key={holding.id}>
            <td className="px-4 py-3 text-sm font-semibold text-brand">{holding.asset_detail?.symbol || holding.asset}</td>
            <td className="px-4 py-3 text-sm">{holding.quantity}</td>
            <td className="px-4 py-3 text-sm">${Number(holding.avg_cost_basis).toFixed(2)}</td>
            <td className="px-4 py-3 text-sm">${Number(holding.market_value).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default HoldingsTable;
