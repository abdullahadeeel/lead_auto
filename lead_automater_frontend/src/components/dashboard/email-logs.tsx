import { apiFetch } from '@/lib/api-client';
import { formatDistanceToNow } from 'date-fns';

interface EmailLog {
  id: string;
  email: string;
  productName: string;
  createdAt: string;
}

export async function EmailLogs({ token }: { token: string }) {
  const logs = await apiFetch<EmailLog[]>('/dashboard/email-logs', {}, token);

  return (
    <div className="bg-white border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-sm font-black text-black uppercase tracking-[0.2em]">Sent Lead Emails</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {logs.map((log) => (
          <div key={log.id} className="p-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-black tracking-tight mb-1">{log.email}</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Target: {log.productName}
              </p>
            </div>
            <p className="text-[10px] text-gray-300 font-black uppercase">
              {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
