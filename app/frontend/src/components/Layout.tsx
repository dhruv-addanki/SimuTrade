import React from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const authFreeRoutes = ['/login', '/register'];
  if (authFreeRoutes.includes(router.pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
