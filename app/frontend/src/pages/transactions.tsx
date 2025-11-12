import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Transaction {
  id: number;
  type: string;
  amount: string;
  reason: string;
  timestamp: string;
}

const typeBadge: Record<string, string> = {
  CREDIT: 'bg-emerald-500/20 text-emerald-300',
  DEBIT: 'bg-rose-500/20 text-rose-300',
  TRADE: 'bg-sky-500/20 text-sky-200',
};

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
    <div className="space-y-6">
      <div>
        <p className="panel-heading">Transactions</p>
        <h1 className="font-display text-3xl font-semibold text-white">Ledger</h1>
      </div>
      <div className="glass-panel overflow-hidden">
        <div className="grid grid-cols-4 gap-4 border-b border-white/10 pb-3 text-xs uppercase tracking-wide text-white/60">
          <span>Type</span>
          <span>Amount</span>
          <span>Reason</span>
          <span>Date</span>
        </div>
        <div className="divide-y divide-white/5">
          {transactions.map((tx) => (
            <div key={tx.id} className="grid grid-cols-1 gap-4 py-3 text-sm text-white/80 md:grid-cols-4">
              <span className={`pill ${typeBadge[tx.type] ?? 'bg-white/5 text-white/70'}`}>{tx.type}</span>
              <span className="font-semibold text-white">${Number(tx.amount).toFixed(2)}</span>
              <span>{tx.reason || '—'}</span>
              <span className="text-white/60">{new Date(tx.timestamp).toLocaleString()}</span>
            </div>
          ))}
          {!transactions.length && <p className="py-6 text-sm text-white/50">No transactions yet.</p>}
        </div>
      </div>
    </div>
  );
}
