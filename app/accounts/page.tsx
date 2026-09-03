'use client';

import React, { useEffect, useState } from 'react';
import { SocialAccount, SocialPlatform } from '@/types';
import { deleteAccount, fetchAccounts, startOAuth } from '@/lib/data/api';
import { useAuth } from '@/lib/auth-context';
import { ALL_PLATFORMS, PLATFORM_CONFIGS } from '@/lib/constants';
import { PlatformConnectCard } from '@/components/accounts/PlatformConnectCard';
import { Share2, CheckCircle2, X, Plus } from 'lucide-react';

export default function AccountsPage() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [configured, setConfigured] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const load = async () => {
    if (!token) return;
    const data = await fetchAccounts(token);
    setAccounts(data.accounts);
    setConfigured(Object.fromEntries(data.platforms.map((p) => [p.platform, p.configured])));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');
    const error = params.get('error');
    const count = params.get('count');
    if (error) setNotification({ type: 'error', message: error });
    if (connected) {
      setNotification({
        type: 'success',
        message: `Connected ${connected}${count ? ` (${count} account${count === '1' ? '' : 's'})` : ''}.`,
      });
    }
    window.history.replaceState({}, '', window.location.pathname);
    load().catch((err) => setNotification({ type: 'error', message: err.message }));
  }, [token]);

  const connect = async (platform: SocialPlatform) => {
    if (!configured[platform]) {
      setNotification({
        type: 'error',
        message: `${PLATFORM_CONFIGS[platform].displayName} is not configured. Add its app credentials in backend/.env.`,
      });
      return;
    }
    if (!token) {
      setNotification({ type: 'error', message: 'Sign in required.' });
      return;
    }
    try {
      const url = await startOAuth(token, platform);
      window.location.href = url;
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const remove = async (id: string) => {
    if (!token) return;
    try {
      await deleteAccount(token, id);
      setAccounts((current) => current.filter((a) => a.id !== id));
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-purple-500 to-pink-500 text-white rounded-2xl">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Connected Social Accounts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              OAuth only. Tokens are encrypted and never shown in the browser.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{accounts.length} connected</span>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Connect a platform</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {ALL_PLATFORMS.map((platform) => {
            const config = PLATFORM_CONFIGS[platform];
            return (
              <button
                key={platform}
                type="button"
                onClick={() => connect(platform)}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left space-y-2 hover:border-indigo-500 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-xl text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: config.brandColor }}
                >
                  {platform.slice(0, 2).toUpperCase()}
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{config.displayName}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  {configured[platform] === false ? 'Add env credentials' : 'Connect with OAuth'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <PlatformConnectCard
            key={acc.id}
            account={acc}
            onToggleConnect={() => remove(acc.id)}
            onDeleteAccount={remove}
          />
        ))}
      </div>

      {accounts.length === 0 && (
        <p className="text-xs text-slate-500 text-center">No accounts connected yet.</p>
      )}
    </div>
  );
}
