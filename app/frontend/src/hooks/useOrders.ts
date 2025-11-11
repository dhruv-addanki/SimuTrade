import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface OrderPayload {
  asset: number;
  order_type: 'MARKET' | 'LIMIT';
  side: 'BUY' | 'SELL';
  quantity: number;
  limit_price?: number;
}

export const useOrders = () => {
  const [openOrders, setOpenOrders] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [openRes, historyRes] = await Promise.all([
        api.get('/orders/open'),
        api.get('/orders/history'),
      ]);
      setOpenOrders(openRes.data);
      setHistory(historyRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, 10000);
    return () => clearInterval(timer);
  }, []);

  const placeOrder = async (payload: OrderPayload) => {
    await api.post('/orders/create', payload);
    await fetchOrders();
  };

  const cancelOrder = async (orderId: number) => {
    await api.post(`/orders/cancel/${orderId}`);
    await fetchOrders();
  };

  return { openOrders, history, loading, placeOrder, cancelOrder };
};
