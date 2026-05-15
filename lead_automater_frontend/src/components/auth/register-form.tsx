'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api-client';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setSuccess('Account created! Verification email dispatched.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100 text-center">
          {success}
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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 focus:border-black transition-all outline-none font-medium"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white font-black uppercase tracking-[0.2em] py-5 transition-all hover:bg-blue-600 disabled:opacity-50 shadow-2xl shadow-gray-200"
      >
        {loading ? 'Processing...' : 'Create Account'}
      </button>
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
        Already registered?{' '}
        <Link href="/login" className="text-black hover:text-blue-600 transition-colors">
          Sign In
        </Link>
      </p>
    </form>
  );
}
