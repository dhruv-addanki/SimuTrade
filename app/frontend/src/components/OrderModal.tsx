import React, { useState } from 'react';
import { Asset } from '../lib/types';

interface Props {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    asset: number;
    order_type: 'MARKET' | 'LIMIT';
    side: 'BUY' | 'SELL';
    quantity: number;
    limit_price?: number;
  }) => Promise<void>;
}

const OrderModal: React.FC<Props> = ({ asset, isOpen, onClose, onSubmit }) => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({
      asset: asset.id,
      order_type: orderType,
      side,
      quantity,
      limit_price: orderType === 'LIMIT' ? limitPrice : undefined,
    });
    setSubmitting(false);
    setQuantity(1);
    setLimitPrice(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500">Placing order</p>
            <h3 className="text-xl font-semibold text-brand">{asset.symbol}</h3>
          </div>
          <button onClick={onClose}>&times;</button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            {(['BUY', 'SELL'] as const).map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setSide(option)}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                  side === option ? 'bg-brand text-white' : 'border-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            {(['MARKET', 'LIMIT'] as const).map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setOrderType(option)}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                  orderType === option ? 'bg-brand-light text-white' : 'border-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm text-slate-600">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </div>
          {orderType === 'LIMIT' && (
            <div>
              <label className="block text-sm text-slate-600">Limit price</label>
              <input
                type="number"
                min={0}
                value={limitPrice ?? ''}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </div>
          )}
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
