import { Suspense } from 'react';
import { ProductList } from '@/components/products/product-list';
import { ProductSkeleton } from '@/components/products/product-skeleton';

export default function ProductsPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-black mb-2">Our Collection</h1>
        <p className="text-gray-600">Premium automation tools for your business growth.</p>
      </header>

      <section>
        <Suspense fallback={<ProductSkeleton count={12} />}>
          <ProductList />
        </Suspense>
      </section>
    </div>
  );
}
