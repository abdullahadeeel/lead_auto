import { apiFetch } from '@/lib/api-client';
import { Product } from '@/types';
import { ProductCard } from './product-card';
import { auth } from '@/auth';

async function getRecommendations(token?: string): Promise<Product[]> {
  if (!token) return [];
  try {
    return await apiFetch<Product[]>('/analytics/recommendations', {}, token);
  } catch (error) {
    return [];
  }
}

export async function Recommendations() {
  const session = await auth();
  const products = await getRecommendations((session as any)?.accessToken);

  if (products.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex flex-col mb-10">
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2 text-center sm:text-left">Curation</p>
        <h2 className="text-3xl font-black text-black tracking-tighter text-center sm:text-left uppercase">Recommended</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
