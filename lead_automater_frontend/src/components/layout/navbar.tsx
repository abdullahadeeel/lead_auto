'use client';

import Link from 'next/link';
import { ShoppingCart, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { LogoutButton } from '@/components/auth/logout-button';
import { useCartStore } from '@/store/use-cart-store';

export function Navbar() {
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.items);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-black tracking-tighter">
              LEAD<span className="text-gray-400">AUTO</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/products" className="text-black hover:text-gray-500 px-3 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors">
              Shop
            </Link>
            {session ? (
              <>
                <Link href={session.user?.role === 'ADMIN' ? '/dashboard' : '/user/dashboard'} className="text-black hover:text-gray-500 transition-colors" title="Dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link href="/login" className="text-black hover:text-gray-500 px-3 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors">
                Login
              </Link>
            )}
            <Link href="/cart" className="text-black hover:text-gray-500 p-2 relative transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-black rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
