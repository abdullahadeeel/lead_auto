'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api-client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Try to login directly to handle custom error messages
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.status === 403) {
        setError('Account not verified. Verification email has been resent.');
        return;
      }

      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
        return;
      }

      // 2. If login successful, use signIn to create the session
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-black uppercase tracking-widest border border-red-100 text-center">
          {error}
        </div>
      )}
      <div>
        <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 focus:border-black transition-all outline-none font-medium"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 focus:border-black transition-all outline-none font-medium"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white font-black uppercase tracking-[0.2em] py-5 transition-all hover:bg-gray-800 disabled:opacity-50 shadow-2xl shadow-gray-200"
      >
        {loading ? 'Processing...' : 'Sign In'}
      </button>
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
        New here?{' '}
        <Link href="/register" className="text-black hover:text-gray-500 transition-colors">
          Create Account
        </Link>
      </p>
    </form>
  );
}
