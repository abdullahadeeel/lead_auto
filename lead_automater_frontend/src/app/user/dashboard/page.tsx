import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { UserActivity } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface UserSummary {
    email: string;
    activities: UserActivity[];
}

export default async function UserDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const token = (session as any).accessToken;
  const summary = await apiFetch<UserSummary>('/dashboard/user-summary', {}, token);

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <header className="mb-12">
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em] mb-3">Welcome</p>
        <h1 className="text-4xl font-black text-black tracking-tighter uppercase">{summary.email}</h1>
      </header>
      
      <div className="bg-white border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-black text-black uppercase tracking-[0.2em]">Your Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100">
            {summary.activities.map((activity) => (
            <div key={activity.id} className="p-8 flex items-center justify-between">
                <div>
                <p className="text-xs font-black text-black tracking-tight mb-1">
                    {activity.product?.name}
                </p>
                <span className="text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter bg-gray-100 text-gray-500">
                    {activity.type}
                </span>
                </div>
                <p className="text-[10px] text-gray-300 font-black uppercase">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}
