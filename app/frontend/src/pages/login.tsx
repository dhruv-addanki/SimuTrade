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
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow px-6 py-8">
        <h2 className="text-2xl font-semibold text-center text-brand mb-6">Sign in to SimuTrade</h2>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-600">Username</label>
            <input name="username" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" required />
          </div>
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input type="password" name="password" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" required />
          </div>
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Need an account? <Link href="/register" className="text-brand-accent font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}
