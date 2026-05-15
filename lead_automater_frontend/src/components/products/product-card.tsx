'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCartStore } from '@/store/use-cart-store';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  return (
    <div className="bg-white group">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50 border border-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="py-4">
        <div className="flex justify-between items-start mb-1">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">
              {product.category?.name || 'Category'}
            </p>
            <Link href={`/products/${product.id}`}>
              <h2 className="text-base font-bold text-black hover:text-gray-500 transition-colors">
                {product.name}
              </h2>
            </Link>
          </div>
        </div>
        <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-black text-black">
            ${product.price.toFixed(2)}
          </span>
          <button 
            onClick={() => addItem(product)}
            className="text-black hover:text-gray-500 text-xs font-black uppercase tracking-widest transition-colors"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
