'use client';

import React, { useState } from 'react';
import { SocialAccount, SocialPlatform } from '@/types';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  Unplug, 
  ExternalLink,
  Power,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';

interface PlatformConnectCardProps {
  account: SocialAccount;
  onToggleConnect: (id: string) => void;
  onToggleActive?: (id: string) => void;
  onDeleteAccount?: (id: string) => void;
  onConnectCustom?: (platform: SocialPlatform, handle: string, accountType?: string) => void;
}

export function PlatformConnectCard({ 
  account, 
  onToggleConnect,
  onToggleActive,
  onDeleteAccount,
}: PlatformConnectCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);
  const config = PLATFORM_CONFIGS[account.platform];

  const handleConnectClick = () => {
    if (account.platform === 'facebook' && !account.connected) {
      setIsConnecting(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      window.location.href = `${backendUrl}/api/auth/facebook`;
      return;
    }

    if (account.connected) {
      setShowConfirmDisconnect(true);
    } else {
      setIsConnecting(true);
      setTimeout(() => {
        onToggleConnect(account.id);
        setIsConnecting(false);
      }, 600);
    }
  };

  const confirmDisconnect = () => {
    setShowConfirmDisconnect(false);
    onToggleConnect(account.id);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-slate-700/80 rounded-3xl p-5 space-y-4 shadow-md dark:shadow-xl transition-all duration-200 group relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0"
            style={{ backgroundColor: config.brandColor }}
          >
            {account.platform.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              {config.displayName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{account.handle || 'Not Connected'}</p>
          </div>
        </div>

        {account.connected ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700/50">
            Disconnected
          </span>
        )}
      </div>

      {/* Account Info Stats Box */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <div>
          <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold block">Followers / Audience</span>
          <span className="font-bold text-slate-900 dark:text-white">{account.followerCount ? account.followerCount.toLocaleString() : '—'}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold block">Account Type</span>
          <span className="capitalize font-semibold text-indigo-600 dark:text-indigo-400">{account.accountType || 'Page'}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold block">OAuth Scopes</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Granted
          </span>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {/* Main Connect / Disconnect Button */}
          <button
            type="button"
            onClick={handleConnectClick}
            disabled={isConnecting}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              account.connected
                ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
            }`}
          >
            {isConnecting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : account.connected ? (
              <Unplug className="w-3.5 h-3.5" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5" />
            )}
            <span>
              {isConnecting
                ? 'Authenticating...'
                : account.connected
                ? 'Disconnect Account'
                : `Connect ${config.displayName}`}
            </span>
          </button>

          {/* Delete Account (Optional custom account cleanup) */}
          {onDeleteAccount && (
            <button
              onClick={() => onDeleteAccount(account.id)}
              title="Remove Account"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          {account.connected ? 'OAuth Token Active' : 'Ready to Connect'}
        </span>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showConfirmDisconnect && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button 
                onClick={() => setShowConfirmDisconnect(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Disconnect {config.displayName}?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                You are about to revoke the OAuth token for <strong className="text-slate-900 dark:text-white">{account.handle}</strong>. Scheduled posts for this account will pause until reconnected.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDisconnect(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisconnect}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-md shadow-rose-600/20"
              >
                Confirm Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
