'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post, SocialAccount } from '@/types';
import { getStoredPosts, getStoredAccounts, saveStoredPosts } from '@/lib/store';
import { ScheduledCard } from '@/components/calendar/ScheduledCard';
import { EngagementChart } from '@/components/analytics/EngagementChart';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  Share2, 
  TrendingUp, 
  Plus, 
  Sparkles,
  ArrowUpRight,
  Layers
} from 'lucide-react';

import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);

  useEffect(() => {
    setPosts(getStoredPosts());
    setAccounts(getStoredAccounts());
  }, []);

  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const activeAccountsCount = accounts.filter(a => a.connected).length;

  const handleDeletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    saveStoredPosts(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/50 border border-indigo-500/20 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> SocialFlow Command Center
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Creator'}! 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your social channels are running smoothly. You have <strong className="text-indigo-400 font-bold">{scheduledCount} post{scheduledCount !== 1 ? 's' : ''} queued</strong> for auto-publishing today.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/compose"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Post</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Queued Posts</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{scheduledCount}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Auto-worker active
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Published Posts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{publishedCount}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium"> Across 4 active channels</p>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Connected Accounts</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeAccountsCount}</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">OAuth tokens valid</p>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Est. Monthly Reach</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">98.8K</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +14.2% this week
          </p>
        </div>
      </div>

      {/* Main Grid: Chart & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Analytics Chart */}
        <div className="lg:col-span-2 space-y-6">
          <EngagementChart />
        </div>

        {/* Right Column: Upcoming Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Upcoming Queue ({scheduledCount})</span>
            </h3>
            <Link href="/calendar" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              View Calendar →
            </Link>
          </div>

          <div className="space-y-3">
            {posts.filter(p => p.status === 'scheduled').length === 0 ? (
              <div className="p-6 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                No scheduled posts in queue. Click <strong className="text-slate-900 dark:text-white">Create New Post</strong> to queue content!
              </div>
            ) : (
              posts
                .filter(p => p.status === 'scheduled')
                .map((post) => (
                  <ScheduledCard key={post.id} post={post} onDelete={handleDeletePost} />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
