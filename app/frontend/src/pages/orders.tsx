import { useOrders } from '../hooks/useOrders';

export default function OrdersPage() {
  const { openOrders, history, cancelOrder } = useOrders();

  const renderTable = (orders: any[]) => (
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Symbol</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Side</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Type</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Qty</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Status</th>
          <th />
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="px-4 py-3 text-sm font-semibold text-brand">{order.asset_detail?.symbol || order.asset}</td>
            <td className="px-4 py-3 text-sm">{order.side}</td>
            <td className="px-4 py-3 text-sm">{order.order_type}</td>
            <td className="px-4 py-3 text-sm">{order.quantity}</td>
            <td className="px-4 py-3 text-xs">
              <span className={`rounded-full px-2 py-1 ${badgeColor(order.status)}`}>{order.status.replace('_', ' ')}</span>
            </td>
            <td className="px-4 py-3 text-right">
              {['OPEN', 'PARTIALLY_FILLED'].includes(order.status) && (
                <button className="text-sm text-red-500" onClick={() => cancelOrder(order.id)}>
                  Cancel
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow border border-slate-100">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-brand">Open Orders</h3>
        </div>
        {renderTable(openOrders)}
      </section>
      <section className="bg-white rounded-lg shadow border border-slate-100">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-brand">Order History</h3>
        </div>
        {renderTable(history)}
      </section>
    </div>
  );
}

const badgeColor = (status: string) => {
  switch (status) {
    case 'FILLED':
      return 'bg-emerald-100 text-emerald-700';
    case 'CANCELLED':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
};
