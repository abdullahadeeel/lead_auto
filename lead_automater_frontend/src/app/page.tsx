import { Suspense } from 'react';
import { ProductList } from '@/components/products/product-list';
import { ProductSkeleton } from '@/components/products/product-skeleton';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <header className="py-24 border-b border-gray-100 flex flex-col items-center text-center">
        <h1 className="text-6xl sm:text-7xl font-black text-black mb-6 tracking-tighter">
          ADVANCED <span className="text-gray-400">LEADS.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-xl font-medium leading-relaxed">
          The next generation of e-commerce automation. Fast, scalable, and optimized for maximum conversion.
        </p>
        <div className="mt-10 flex gap-4">
            <button className="bg-black text-white px-10 py-4 rounded-full font-bold transition-transform hover:bg-gray-800 active:scale-95">
                Explore Store
            </button>
            <button className="border-2 border-black text-black px-10 py-4 rounded-full font-bold transition-transform hover:bg-gray-100 active:scale-95">
                Learn More
            </button>
        </div>
      </header>

      <section>
        <div className="flex flex-col mb-12">
          <p className="text-black font-black text-sm uppercase tracking-widest mb-2">Featured</p>
          <h2 className="text-4xl font-black text-black">New Arrivals</h2>
        </div>
        
        <Suspense fallback={<ProductSkeleton count={8} />}>
          <ProductList />
        </Suspense>
      </section>
    </div>
  );
}
