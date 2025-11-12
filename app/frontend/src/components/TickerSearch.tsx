import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Asset } from '../lib/types';

interface Props {
  onSelect: (asset: Asset) => void;
}

const TickerSearch: React.FC<Props> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Asset[]>([]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const { data } = await api.get('/market/search', { params: { q: query } });
      setResults(data);
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="glass-panel space-y-4">
      <div>
        <p className="panel-heading">Ticker Scanner</p>
        <p className="text-lg font-semibold text-white">Search any US equity</p>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Type symbol or company name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-accent focus:outline-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wide text-white/40">
          ⌘K
        </span>
      </div>
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {results.map((asset) => (
          <button
            key={asset.id}
            className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left transition hover:border-brand-accent hover:bg-white/10"
            onClick={() => onSelect(asset)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{asset.symbol}</p>
                <p className="text-xs text-white/60">{asset.name}</p>
              </div>
              <p className="text-base font-semibold text-brand-accent">
                ${Number(asset.last_price).toFixed(2)}
              </p>
            </div>
          </button>
        ))}
        {!results.length && (
          <p className="text-sm text-white/50">Start typing to explore supported symbols.</p>
        )}
      </div>
    </div>
  );
};

export default TickerSearch;
