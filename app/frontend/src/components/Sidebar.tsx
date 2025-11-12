import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'activity' },
  { href: '/markets', label: 'Markets', icon: 'spark' },
  { href: '/portfolio', label: 'Portfolio', icon: 'wallet' },
  { href: '/orders', label: 'Orders', icon: 'pulse' },
  { href: '/transactions', label: 'Transactions', icon: 'dots' },
];

const iconMap: Record<string, JSX.Element> = {
  activity: (
    <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-accent/40 to-brand-glow/40 p-2 text-brand-accent">
      ▤
    </span>
  ),
  spark: (
    <span className="h-8 w-8 rounded-xl bg-white/5 p-2 text-brand-glow">⚡</span>
  ),
  wallet: (
    <span className="h-8 w-8 rounded-xl bg-white/5 p-2 text-emerald-300">💼</span>
  ),
  pulse: (
    <span className="h-8 w-8 rounded-xl bg-white/5 p-2 text-rose-300">☰</span>
  ),
  dots: (
    <span className="h-8 w-8 rounded-xl bg-white/5 p-2 text-sky-300">⋯</span>
  ),
};

const Sidebar: React.FC = () => {
  const router = useRouter();
  return (
    <aside className="hidden w-64 flex-col border-r border-white/5 bg-white/5 p-6 backdrop-blur-xl lg:flex">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Control</p>
        <h2 className="font-display text-2xl font-semibold text-white">Command</h2>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-white/10 to-brand-accent/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {iconMap[item.icon]}
              <span>{item.label}</span>
              {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-brand-accent shadow-glow" />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        <p className="font-medium text-white">System Health</p>
        <p className="text-xs text-white/60">Alpha feed active · Redis synced</p>
      </div>
    </aside>
  );
};

export default Sidebar;
