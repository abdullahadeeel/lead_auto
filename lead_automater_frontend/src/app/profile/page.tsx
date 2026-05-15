import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <div className="mb-10 text-center">
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em] mb-3">User Account</p>
        <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Profile</h1>
      </div>
      
      <div className="bg-white p-10 border border-gray-100 shadow-xl shadow-gray-100">
        <div className="space-y-8">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</p>
                <p className="text-2xl font-black text-black">{session.user?.email}</p>
            </div>
            <div className="pt-6 border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Account Role</p>
                <span className="px-4 py-2 bg-gray-100 text-black text-xs font-black uppercase tracking-widest rounded-full">
                    {(session as any).user?.role}
                </span>
            </div>
            <div className="pt-6 border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Account ID</p>
                <p className="text-xs font-mono text-gray-500 break-all">{session.user?.id}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
