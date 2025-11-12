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

  const optionBtn = (active: boolean) =>
    `flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
      active ? 'bg-white text-slate-900' : 'border-white/20 text-white/70 hover:border-white/40'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-glow backdrop-blur-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="panel-heading">New Order</p>
            <h3 className="text-2xl font-semibold text-white">
              {asset.symbol} <span className="text-white/60">{asset.name}</span>
            </h3>
          </div>
          <button onClick={onClose} className="pill hover:text-white">
            Close
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            {(['BUY', 'SELL'] as const).map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setSide(option)}
                className={optionBtn(side === option)}
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
                className={optionBtn(orderType === option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-white/60">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
            />
          </div>
          {orderType === 'LIMIT' && (
            <div>
              <label className="text-xs uppercase tracking-wide text-white/60">Limit price</label>
              <input
                type="number"
                min={0}
                value={limitPrice ?? ''}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
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
