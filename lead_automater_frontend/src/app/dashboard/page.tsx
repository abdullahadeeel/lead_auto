import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { ThresholdSettings } from '@/components/dashboard/threshold-settings';
import { EmailLogs } from '@/components/dashboard/email-logs';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Graceful handling for non-admin users
  if ((session as any).user?.role !== 'ADMIN') {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h1 className="text-4xl font-black text-black tracking-tighter uppercase mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-8 font-medium">You do not have administrative privileges to view this dashboard.</p>
        <Link href="/user/dashboard" className="inline-block bg-black text-white px-8 py-4 font-black text-xs uppercase tracking-widest transition-all hover:bg-gray-800">
            Back to User Dashboard
        </Link>
      </div>
    );
  }

  const token = (session as any).accessToken;

  return (
    <div className="space-y-12 py-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-gray-100">
        <div>
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em] mb-3">Management</p>
            <h1 className="text-5xl font-black text-black tracking-tighter uppercase">Overview</h1>
        </div>
        <div className="flex gap-2">
            <div className="px-4 py-2 bg-gray-50 text-black text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-100 flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-black rounded-full animate-pulse" />
                Live System
            </div>
            <div className="px-4 py-2 bg-gray-50 text-black text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-100">
                v1.0.4
            </div>
        </div>
      </header>

      <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse" />}>
        <StatsGrid token={token} />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
            <RecentActivities token={token} />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
            <EmailLogs token={token} />
          </Suspense>
      </div>
      
      <ThresholdSettings />
    </div>
  );
}
