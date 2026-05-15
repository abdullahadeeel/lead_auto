'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useSession } from 'next-auth/react';

export function ThresholdSettings() {
  const { data: session } = useSession();
  const [threshold, setThreshold] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !(session as any).accessToken) return;
    
    setLoading(true);
    try {
      await apiFetch('/dashboard/settings/threshold', {
        method: 'POST',
        body: JSON.stringify({ threshold: parseInt(threshold) }),
      }, (session as any).accessToken);
      setMessage('Threshold updated successfully');
    } catch (err) {
      setMessage('Failed to update threshold');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 border border-gray-100">
      <h3 className="text-sm font-black text-black uppercase tracking-[0.2em] mb-6">Lead Generation Threshold</h3>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          placeholder="Enter threshold (e.g., 3)"
          className="px-4 py-3 bg-gray-50 border border-gray-100 outline-none w-full"
        />
        <button disabled={loading} className="bg-black text-white px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-800">
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
      {message && <p className="mt-4 text-xs font-bold text-gray-500">{message}</p>}
    </div>
  );
}
