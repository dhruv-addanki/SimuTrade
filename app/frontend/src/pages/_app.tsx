import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { useAuthStore } from '../hooks/useAuth';

function App({ Component, pageProps }: AppProps) {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initialized = useAuthStore((state) => state.initialized);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const guardRoutes = ['/dashboard', '/markets', '/portfolio', '/orders', '/transactions'];
    if (!initialized) return;
    if (guardRoutes.includes(router.pathname) && !isAuthenticated) {
      router.replace('/login');
    }
  }, [router, router.pathname, isAuthenticated, initialized]);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
