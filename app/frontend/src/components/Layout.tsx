import React from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const gradientBg =
  'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),transparent_45%)]';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const authFreeRoutes = ['/login', '/register'];

  if (authFreeRoutes.includes(router.pathname)) {
    return (
      <div className={`min-h-screen relative overflow-hidden ${gradientBg}`}>
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 opacity-50 bg-grid-pattern bg-[length:280px_280px]" />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
          <div className="w-full max-w-5xl">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${gradientBg}`}>
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 opacity-40 bg-grid-pattern bg-[length:300px_300px]" />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 px-6 pb-10 pt-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
