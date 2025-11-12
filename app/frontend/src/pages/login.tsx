import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuthStore();
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    try {
      await login(username, password);
      router.replace('/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="glass-panel mx-auto max-w-4xl overflow-hidden border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/60">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6 rounded-2xl bg-white/5 p-8">
          <p className="panel-heading">Welcome back</p>
          <h2 className="font-display text-3xl text-white">Sign in to SimuTrade</h2>
          <p className="text-sm text-white/60">Continue orchestrating your simulated trades with institutional tooling.</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• Portfolio heatmaps</li>
            <li>• Real-time paper execution</li>
            <li>• Alpha Vantage / Finnhub market feed</li>
          </ul>
        </div>
        <div className="space-y-4 p-8">
          {error && <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/60">Username</label>
              <input
                name="username"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-brand-accent focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/60">Password</label>
              <input
                type="password"
                name="password"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-brand-accent focus:outline-none"
                required
              />
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-sm text-white/60">
            Need an account?{' '}
            <Link href="/register" className="text-brand-accent font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
