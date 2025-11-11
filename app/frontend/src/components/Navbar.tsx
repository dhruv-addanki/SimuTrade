import React from 'react';
import { useAuthStore } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { profile, logout } = useAuthStore();

  return (
    <header className="w-full border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-brand">SimuTrade</h1>
      <div className="flex items-center gap-4">
        {profile && (
          <div className="text-sm text-slate-600">
            Cash: <span className="font-semibold text-brand">${Number(profile.current_balance).toLocaleString()}</span>
          </div>
        )}
        <button className="text-sm font-medium text-brand-accent" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
