'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useSession } from 'next-auth/react';

export function WishlistButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!session || !(session as any).accessToken) return;

    setLoading(true);
    try {
      await apiFetch('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ productId, type: 'LIKE' }),
      }, (session as any).accessToken);
      alert('Added to wishlist!');
    } catch (err) {
      console.error('Failed to track like:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="px-8 py-5 border-2 border-black text-black font-black uppercase tracking-widest transition-all hover:bg-gray-50 active:scale-95"
    >
      {loading ? '...' : '♥ Wishlist'}
    </button>
  );
}
