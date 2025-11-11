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
    const fetchPrice = async () => {
      const { data } = await api.get(`/market/price/${selectedAsset.symbol}`);
      setPrice(Number(data.price));
    };
    fetchPrice();
    const timer = setInterval(fetchPrice, 5000);
    return () => clearInterval(timer);
  }, [selectedAsset]);

  return (
    <div className="space-y-6">
      <TickerSearch
        onSelect={(asset) => {
          setSelectedAsset(asset);
          setModalOpen(true);
        }}
      />
      {selectedAsset && (
        <div className="bg-white rounded-lg p-4 shadow border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Selected</p>
            <h3 className="text-2xl font-semibold text-brand">{selectedAsset.symbol}</h3>
            <p className="text-sm text-slate-500">{selectedAsset.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Last price</p>
            <p className="text-3xl font-bold text-brand-accent">${price?.toFixed(2) ?? '--'}</p>
          </div>
        </div>
      )}
      <OrderModal
        asset={selectedAsset}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={placeOrder}
      />
    </div>
  );
}
