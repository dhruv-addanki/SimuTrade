import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/markets', label: 'Markets' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/orders', label: 'Orders' },
  { href: '/transactions', label: 'Transactions' },
];

const Sidebar: React.FC = () => {
  const router = useRouter();
  return (
    <aside className="w-56 bg-white border-r border-slate-200 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-2 text-sm font-medium ${
              router.pathname === item.href ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
