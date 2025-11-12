import { useEffect, useState } from 'react';
import OrderModal from '../components/OrderModal';
import TickerSearch from '../components/TickerSearch';
import { Asset } from '../lib/types';
import { api } from '../lib/api';
import { useOrders } from '../hooks/useOrders';

export default function MarketsPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { placeOrder } = useOrders();

  useEffect(() => {
    if (!selectedAsset) return;
    let isMounted = true;
    const fetchPrice = async () => {
      const { data } = await api.get(`/market/price/${selectedAsset.symbol}`);
      if (isMounted) {
        setPrice(Number(data.price));
      }
    };
    fetchPrice();
    const timer = setInterval(fetchPrice, 5000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [selectedAsset]);

  const handleSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="panel-heading">Markets</p>
        <h1 className="font-display text-3xl font-semibold text-white">Live order flow</h1>
        <p className="text-white/60">Tap into simulated liquidity with streaming quotes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TickerSearch onSelect={handleSelect} />
        </div>
        {selectedAsset && (
          <div className="glass-panel flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="panel-heading">Selected</p>
                <h3 className="text-3xl font-semibold text-white">{selectedAsset.symbol}</h3>
                <p className="text-white/60">{selectedAsset.name}</p>
              </div>
              <span className="pill bg-brand-accent/20 text-brand-accent">{selectedAsset.asset_type}</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">Last Price</p>
                <p className="font-display text-4xl font-semibold text-brand-accent">
                  {price ? `$${price.toFixed(2)}` : '--'}
                </p>
              </div>
              <button className="btn-primary" onClick={() => setModalOpen(true)}>
                Trade Now
              </button>
            </div>
            <p className="text-xs text-white/50">
              Quotes refresh every 5 seconds · Prices via {process.env.NEXT_PUBLIC_API_BASE_URL ? 'API' : 'provider'} feed.
            </p>
          </div>
        )}
      </div>

      <OrderModal
        asset={selectedAsset}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={placeOrder}
      />
    </div>
  );
}
