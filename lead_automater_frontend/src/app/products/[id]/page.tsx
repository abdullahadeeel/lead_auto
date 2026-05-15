import { Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { Product } from '@/types';
import { Recommendations } from '@/components/products/recommendations';
import { ViewTracker } from '@/components/products/view-tracker';
import { WishlistButton } from '@/components/products/wishlist-button';
import { ProductSkeleton } from '@/components/products/product-skeleton';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product> {
  try {
    return await apiFetch<Product>(`/products/${id}`, {
      next: { tags: [`product-${id}`], revalidate: 3600 },
    });
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  const products = await apiFetch<Product[]>('/products');
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div className="space-y-20 py-10">
      <ViewTracker productId={id} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="relative aspect-square bg-gray-50 border border-gray-100 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">
              {product.category?.name}
            </span>
            <h1 className="text-5xl font-black text-black mt-3 tracking-tighter">
              {product.name}
            </h1>
          </div>

          <p className="text-xl text-gray-500 leading-relaxed mb-10 font-medium">
            {product.description}
          </p>

          <div className="flex flex-col space-y-6 mb-12">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Price</p>
              <p className="text-5xl font-black text-black tracking-tight">
                ${product.price.toFixed(2)}
              </p>
            </div>
            
            <div className="flex gap-4">
                <button className="flex-1 bg-black text-white px-8 py-5 text-lg font-black uppercase tracking-widest transition-all hover:bg-gray-800 active:scale-95 shadow-2xl shadow-gray-200">
                    Add to Cart
                </button>
                <WishlistButton productId={id} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-gray-100">
            <div>
              <p className="font-black text-black uppercase tracking-widest text-xs mb-1">Shipping</p>
              <p className="text-sm text-gray-500 font-medium">Free international delivery on all orders over $150.</p>
            </div>
            <div>
              <p className="font-black text-black uppercase tracking-widest text-xs mb-1">Authenticity</p>
              <p className="text-sm text-gray-500 font-medium">100% genuine automation tools guaranteed.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="pt-20 border-t border-gray-100">
        <Suspense fallback={<ProductSkeleton count={4} />}>
            <Recommendations />
        </Suspense>
      </section>
    </div>
  );
}
