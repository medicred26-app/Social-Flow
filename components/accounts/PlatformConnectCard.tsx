'use client';

import React, { useState } from 'react';
import { SocialAccount } from '@/types';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { CheckCircle2, ShieldCheck, Unplug, Trash2, AlertTriangle, X } from 'lucide-react';

interface PlatformConnectCardProps {
  account: SocialAccount;
  onToggleConnect: (id: string) => void;
  onDeleteAccount?: (id: string) => void;
}

export function PlatformConnectCard({ account, onDeleteAccount }: PlatformConnectCardProps) {
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);
  const config = PLATFORM_CONFIGS[account.platform];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: config.brandColor }}
          >
            {account.platform.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{account.name}</h4>
            <p className="text-xs text-slate-500">{account.handle || config.displayName}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" /> Connected
        </span>
      </div>

      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] uppercase text-slate-500 font-semibold block">Followers</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {account.followerCount ? account.followerCount.toLocaleString() : '—'}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-500 font-semibold block">Type</span>
          <span className="capitalize font-semibold text-indigo-600">{account.accountType || '—'}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-500 font-semibold block">Tokens</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Encrypted
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowConfirmDisconnect(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-200 dark:border-rose-500/30"
        >
          <Unplug className="w-3.5 h-3.5" />
          Disconnect
        </button>
        {onDeleteAccount && (
          <button
            type="button"
            onClick={() => onDeleteAccount(account.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showConfirmDisconnect && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button onClick={() => setShowConfirmDisconnect(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Disconnect {config.displayName}?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This deletes the stored OAuth tokens for {account.handle || account.name}. Scheduled posts for this
                account will fail until you reconnect.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmDisconnect(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmDisconnect(false);
                  onDeleteAccount?.(account.id);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 text-white"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
