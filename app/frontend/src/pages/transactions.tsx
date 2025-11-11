import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Transaction {
  id: number;
  type: string;
  amount: string;
  reason: string;
  timestamp: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    };
    fetchTransactions();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow border border-slate-100">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-brand">Transaction History</h3>
      </div>
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Type</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Amount</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Reason</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="px-4 py-3 text-sm">{tx.type}</td>
              <td className="px-4 py-3 text-sm">${Number(tx.amount).toFixed(2)}</td>
              <td className="px-4 py-3 text-sm">{tx.reason}</td>
              <td className="px-4 py-3 text-sm">{new Date(tx.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
