import { useOrders } from '../hooks/useOrders';

const statusStyles: Record<string, string> = {
  FILLED: 'bg-emerald-500/20 text-emerald-300',
  CANCELLED: 'bg-rose-500/20 text-rose-300',
  OPEN: 'bg-amber-500/20 text-amber-200',
  PARTIALLY_FILLED: 'bg-sky-500/20 text-sky-200',
};

export default function OrdersPage() {
  const { openOrders, history, cancelOrder } = useOrders();

  const renderList = (orders: any[], showActions?: boolean) => (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:border-brand-accent/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-white">{order.asset_detail?.symbol || order.asset}</p>
              <p className="text-xs text-white/60">
                {order.side} · {order.order_type} · Qty {order.quantity}
              </p>
            </div>
            <span className={`pill ${statusStyles[order.status] ?? 'bg-white/10 text-white/70'}`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-white/60">
            <p>Created {new Date(order.created_at).toLocaleString()}</p>
            {showActions && ['OPEN', 'PARTIALLY_FILLED'].includes(order.status) && (
              <button className="text-rose-300 hover:text-rose-200" onClick={() => cancelOrder(order.id)}>
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
      {!orders.length && <p className="text-sm text-white/50">No orders yet.</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="panel-heading">Orders</p>
        <h1 className="font-display text-3xl font-semibold text-white">Execution queue</h1>
      </div>
      <section className="glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Open Orders</p>
            <p className="text-sm text-white/60">Live orders waiting for fills</p>
          </div>
          <span className="pill bg-white/10 text-white/70">{openOrders.length}</span>
        </div>
        {renderList(openOrders, true)}
      </section>
      <section className="glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Order History</p>
            <p className="text-sm text-white/60">Chronological audit trail</p>
          </div>
          <span className="pill bg-white/10 text-white/70">{history.length}</span>
        </div>
        {renderList(history)}
      </section>
    </div>
  );
}
