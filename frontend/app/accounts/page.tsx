'use client';

import React, { useState, useEffect } from 'react';
import { SocialAccount, SocialPlatform } from '@/types';
import { getStoredAccounts, saveStoredAccounts } from '@/lib/store';
import { PlatformConnectCard } from '@/components/accounts/PlatformConnectCard';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { 
  Share2, 
  Plus, 
  CheckCircle2, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sparkles,
  X,
  Radio
} from 'lucide-react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [filter, setFilter] = useState<'all' | 'connected' | 'disconnected'>('all');
  const [showConnectModal, setShowConnectModal] = useState(false);
  
  // Custom Connect Modal State
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [handleInput, setHandleInput] = useState('');
  const [accountTypeInput, setAccountTypeInput] = useState<'page' | 'profile' | 'channel' | 'business'>('business');
  const [followerCountInput, setFollowerCountInput] = useState('12500');

  useEffect(() => {
    setAccounts(getStoredAccounts());
  }, []);

  const handleToggleConnect = (id: string) => {
    const updated = accounts.map((acc) => {
      if (acc.id === id) {
        return { ...acc, connected: !acc.connected };
      }
      return acc;
    });
    setAccounts(updated);
    saveStoredAccounts(updated);
  };

  const handleDeleteAccount = (id: string) => {
    const updated = accounts.filter(acc => acc.id !== id);
    setAccounts(updated);
    saveStoredAccounts(updated);
  };

  const handleAddCustomAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;

    const newAcc: SocialAccount = {
      id: `acc-${selectedPlatform}-${Date.now()}`,
      platform: selectedPlatform,
      name: handleInput.replace('@', ''),
      handle: handleInput.startsWith('@') ? handleInput : `@${handleInput}`,
      connected: true,
      accountType: accountTypeInput,
      followerCount: parseInt(followerCountInput) || 5000,
      avatarUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80`
    };

    const updated = [newAcc, ...accounts];
    setAccounts(updated);
    saveStoredAccounts(updated);

    // Reset & close modal
    setHandleInput('');
    setShowConnectModal(false);
  };

  const filteredAccounts = accounts.filter((acc) => {
    if (filter === 'connected') return acc.connected;
    if (filter === 'disconnected') return !acc.connected;
    return true;
  });

  const connectedCount = accounts.filter(a => a.connected).length;
  const totalCount = accounts.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg shadow-purple-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Connected Social Accounts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Connect, disconnect, and manage OAuth 2.0 authorization tokens for multi-channel publishing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{connectedCount} of {totalCount} Connected</span>
          </div>

          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Channel</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Quick Info */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Channels ({accounts.length})
          </button>
          <button
            onClick={() => setFilter('connected')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'connected'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Connected ({connectedCount})
          </button>
          <button
            onClick={() => setFilter('disconnected')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'disconnected'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Disconnected ({accounts.length - connectedCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>OAuth tokens are encrypted at rest</span>
        </div>
      </div>

      {/* Grid of Platform Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAccounts.map((acc) => (
          <PlatformConnectCard
            key={acc.id}
            account={acc}
            onToggleConnect={handleToggleConnect}
            onDeleteAccount={handleDeleteAccount}
          />
        ))}
      </div>

      {/* Connect Account Modal Dialog */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-lg">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span>Connect New Social Channel</span>
              </div>
              <button 
                onClick={() => setShowConnectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomAccount} className="space-y-4">
              {/* Select Platform */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Select Social Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(PLATFORM_CONFIGS) as SocialPlatform[]).map((plat) => {
                    const cfg = PLATFORM_CONFIGS[plat];
                    const isSelected = selectedPlatform === plat;
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setSelectedPlatform(plat)}
                        className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <div 
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: cfg.brandColor }}
                        >
                          {plat.substring(0, 2).toUpperCase()}
                        </div>
                        <span>{cfg.displayName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Account Handle / Username */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Account Handle or Page Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="@yourbrand or Page Title"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Account Type & Followers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Account Type
                  </label>
                  <select
                    value={accountTypeInput}
                    onChange={(e) => setAccountTypeInput(e.target.value as 'page' | 'profile' | 'channel' | 'business')}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="business">Business</option>
                    <option value="profile">Profile</option>
                    <option value="page">Page</option>
                    <option value="channel">Channel</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Initial Audience Count
                  </label>
                  <input
                    type="number"
                    value={followerCountInput}
                    onChange={(e) => setFollowerCountInput(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md shadow-indigo-500/25 transition-all"
                >
                  Authorize & Connect Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
