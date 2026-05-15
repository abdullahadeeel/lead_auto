'use client';

import { useCartStore } from '@/store/use-cart-store';

export function CartPage() {
  const { items, removeItem } = useCartStore();

  if (items.length === 0) {
    return <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest">Cart is empty</div>;
  }

  return (
    <div className="py-20">
      <h1 className="text-4xl font-black text-black mb-10 tracking-tighter uppercase">Your Cart</h1>
      <div className="border-t border-gray-100">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-6 border-b border-gray-100">
            <div>
              <p className="font-bold text-black">{item.name}</p>
              <p className="text-xs text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-10 flex justify-end">
        <button className="bg-black text-white px-10 py-4 font-black text-xs uppercase tracking-widest transition-all hover:bg-gray-800">
          Checkout
        </button>
      </div>
    </div>
  );
}
