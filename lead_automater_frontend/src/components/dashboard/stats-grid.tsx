import { apiFetch } from '@/lib/api-client';
import { DashboardStats } from '@/types';
import { Users, Package, Activity } from 'lucide-react';

async function getStats(token: string): Promise<DashboardStats> {
  return apiFetch<DashboardStats>('/dashboard/stats', {}, token);
}

export async function StatsGrid({ token }: { token: string }) {
  try {
    const stats = await getStats(token);

    const items = [
      { label: 'Users', value: stats.userCount, icon: Users },
      { label: 'Inventory', value: stats.productCount, icon: Package },
      { label: 'Engagements', value: stats.activityCount, icon: Activity },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.label} className="bg-white p-8 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{item.label}</p>
              <p className="text-4xl font-black text-black tracking-tighter">{item.value}</p>
            </div>
            <item.icon className="h-8 w-8 text-black opacity-10" strokeWidth={3} />
          </div>
        ))}
      </div>
    );
  } catch (error: any) {
    console.error('StatsGrid error:', error);
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
