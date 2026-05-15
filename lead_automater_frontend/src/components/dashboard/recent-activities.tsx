import { apiFetch } from '@/lib/api-client';
import { UserActivity } from '@/types';
import { formatDistanceToNow } from 'date-fns';

async function getRecentActivities(token: string): Promise<UserActivity[]> {
  return apiFetch<UserActivity[]>('/dashboard/recent-activities', {}, token);
}

export async function RecentActivities({ token }: { token: string }) {
  try {
    const activities = await getRecentActivities(token);

    return (
      <div className="bg-white border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-sm font-black text-black uppercase tracking-[0.2em]">Activity Stream</h2>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-white px-3 py-1 border border-blue-100">Real-time</span>
        </div>
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <div key={activity.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div>
                <p className="text-xs font-black text-black tracking-tight mb-1">
                  {activity.user?.email}
                </p>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter ${activity.type === 'VIEW' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                      {activity.type}
                  </span>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {activity.product?.name}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-gray-300 font-black uppercase">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error: any) {
    if (error.message.includes('Forbidden') || error.message.includes('403')) {
      return (
        <div className="bg-red-50 p-6 border border-red-100 text-red-600 font-bold text-center">
          Access Denied: Admin privileges required.
        </div>
      );
    }
    throw error;
  }
}
