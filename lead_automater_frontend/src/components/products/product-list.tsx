import { apiFetch } from '@/lib/api-client';
import { Product } from '@/types';
import { ProductCard } from './product-card';

async function getProducts(): Promise<Product[]> {
  // Use Next.js fetch cache with tags for high-performance revalidation
  return apiFetch<Product[]>('/products', {
    next: { tags: ['products'], revalidate: 3600 }, // ISR: 1 hour default
  });
}

export async function ProductList() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-500">No products found</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
