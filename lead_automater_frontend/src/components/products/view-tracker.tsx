'use client';

import { useEffect } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useSession } from 'next-auth/react';

export function ViewTracker({ productId }: { productId: string }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      // Track view asynchronously
      apiFetch('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ productId, type: 'VIEW' }),
      }, session.accessToken).catch(console.error);
    }
  }, [productId, session]);

  return null;
}
