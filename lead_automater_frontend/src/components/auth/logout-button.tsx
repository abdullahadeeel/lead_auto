'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-black hover:text-gray-500 font-bold uppercase tracking-widest text-[10px] transition-colors"
    >
      Logout
    </button>
  );
}
