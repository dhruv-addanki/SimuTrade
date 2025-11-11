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
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="bg-white rounded-lg p-4 shadow border border-slate-100">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search ticker"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-md border border-slate-200 px-3 py-2"
        />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
        {results.map((asset) => (
          <button
            key={asset.id}
            className="border rounded-md px-3 py-2 text-left hover:border-brand transition"
            onClick={() => onSelect(asset)}
          >
            <p className="text-sm font-semibold text-brand">{asset.symbol}</p>
            <p className="text-xs text-slate-500">{asset.name}</p>
            <p className="text-sm text-brand-accent mt-1">${Number(asset.last_price).toFixed(2)}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TickerSearch;
