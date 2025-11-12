import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '../hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuthStore();
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
      await register(username, email, password);
      router.replace('/dashboard');
    } catch {
      setError('Unable to register');
    }
  };

  return (
    <div className="glass-panel mx-auto max-w-4xl overflow-hidden border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/60">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6 p-8">
          <p className="panel-heading">Get started</p>
          <h2 className="font-display text-3xl text-white">Create your workspace</h2>
          <p className="text-sm text-white/60">
            Paper trade equities with real-time quotes, order matching, and institutional-style risk reports.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p className="font-semibold text-white">What you get:</p>
            <ul className="mt-2 space-y-1">
              <li>• Portfolio heatmaps & analytics</li>
              <li>• Streaming Alpha Vantage/Finnhub data</li>
              <li>• Celery powered order automation</li>
            </ul>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl bg-white/5 p-8">
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
              <label className="text-xs uppercase tracking-wide text-white/60">Email</label>
              <input
                name="email"
                type="email"
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
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>
          <p className="text-sm text-white/60">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-accent font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
