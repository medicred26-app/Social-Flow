'use client';

import React from 'react';
import { SocialAccount, SocialPlatform } from '@/types';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { Check, Plus } from 'lucide-react';

interface PlatformSelectorProps {
  accounts: SocialAccount[];
  selectedAccountIds: string[];
  onToggleAccount: (id: string) => void;
}

export function PlatformSelector({
  accounts,
  selectedAccountIds,
  onToggleAccount,
}: PlatformSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Publish Channels ({selectedAccountIds.length} selected)
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">Click to toggle channels</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {accounts.map((acc) => {
          const isSelected = selectedAccountIds.includes(acc.id);
          const config = PLATFORM_CONFIGS[acc.platform];

          return (
            <button
              key={acc.id}
              type="button"
              onClick={() => onToggleAccount(acc.id)}
              className={`relative flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="relative">
                <img
                  src={acc.avatarUrl}
                  alt={acc.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <span 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ backgroundColor: config.brandColor }}
                >
                  {acc.platform.substring(0, 1).toUpperCase()}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{acc.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{acc.handle}</p>
              </div>

              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-transparent'
              }`}>
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
