'use client';

import React, { useEffect, useState } from 'react';
import { fetchSettingsStatus } from '@/lib/data/api';
import { useAuth } from '@/lib/auth-context';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { Settings, Shield, Key, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { token } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchSettingsStatus(token)
      .then(setStatus)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-slate-800 text-white rounded-2xl">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">System status</h1>
          <p className="text-xs text-slate-400">Live configuration. Secrets are never shown here.</p>
        </div>
      </div>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Runtime</h3>
            <p className="text-xs text-slate-400">Supabase, encryption, and the due-post worker</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            ['Supabase URL', status?.supabaseUrl],
            ['Service role (scheduler)', status?.serviceRole],
            ['Token encryption key', status?.encryptionKey],
            ['Cron secret', status?.cronSecret],
            ['Inline scheduler', status?.inlineScheduler],
          ].map(([label, ok]) => (
            <div key={String(label)} className="flex items-center justify-between rounded-xl border border-slate-800 px-3 py-2">
              <span className="text-slate-300">{label}</span>
              {ok ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Missing
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Platform OAuth apps</h3>
            <p className="text-xs text-slate-400">Set these in frontend/.env.local, then restart Next.js</p>
          </div>
        </div>
        <div className="space-y-2">
          {(status?.platforms || []).map((item: { platform: keyof typeof PLATFORM_CONFIGS; configured: boolean }) => (
            <div key={item.platform} className="flex items-center justify-between rounded-xl border border-slate-800 px-3 py-2 text-xs">
              <span className="text-slate-200">{PLATFORM_CONFIGS[item.platform].displayName}</span>
              {item.configured ? (
                <span className="text-emerald-400">Configured</span>
              ) : (
                <span className="text-amber-400">Not configured</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Shield className="w-4 h-4 text-emerald-400" />
          What is stored
        </div>
        <p>User profiles, connected account details, encrypted OAuth tokens, captions, schedules, and publish results.</p>
        <p>Photos and videos uploaded from a device are stored in the post-media bucket so platforms can fetch them.</p>
      </div>
    </div>
  );
}
