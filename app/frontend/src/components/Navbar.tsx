import React from 'react';
import { useAuthStore } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { profile, logout } = useAuthStore();

  return (
    <header className="flex w-full items-center justify-between border-b border-white/5 bg-white/5 px-6 py-4 backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">SimuTrade</p>
        <h1 className="font-display text-xl font-semibold text-white">
          Market Pulse <span className="text-brand-accent">Realtime</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {profile && (
          <div className="hidden md:flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">Cash</p>
              <p className="font-semibold text-white">
                ${Number(profile.current_balance).toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">PnL</p>
              <p className="font-semibold text-emerald-300">
                ${Number(profile.total_pnl).toLocaleString()}
              </p>
            </div>
          </div>
        )}
        <button className="pill hover:text-white" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
