import React from 'react';
import { Holding } from '../hooks/usePortfolio';

interface Props {
  holdings: Holding[];
}

const HoldingsTable: React.FC<Props> = ({ holdings }) => (
  <div className="glass-panel overflow-hidden">
    <div className="flex items-center justify-between pb-4">
      <p className="panel-heading">Holdings</p>
      <span className="pill bg-white/10 text-white/70">{holdings.length} assets</span>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-white/60">
            <th className="pb-3 text-left font-medium">Symbol</th>
            <th className="pb-3 text-left font-medium">Quantity</th>
            <th className="pb-3 text-left font-medium">Avg Cost</th>
            <th className="pb-3 text-left font-medium">Market Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {holdings.map((holding) => (
            <tr key={holding.id} className="text-white/80">
              <td className="py-3 font-semibold text-white">
                {holding.asset_detail?.symbol || holding.asset}
              </td>
              <td className="py-3">{holding.quantity}</td>
              <td className="py-3">${Number(holding.avg_cost_basis).toFixed(2)}</td>
              <td className="py-3">${Number(holding.market_value).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {!holdings.length && <p className="mt-4 text-sm text-white/50">No holdings yet.</p>}
  </div>
);

export default HoldingsTable;
