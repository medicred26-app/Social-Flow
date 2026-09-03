'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post, SocialAccount } from '@/types';
import { deletePost, fetchAccounts, fetchPosts } from '@/lib/data/api';
import { ScheduledCard } from '@/components/calendar/ScheduledCard';
import { Clock, CheckCircle2, Share2, Plus, Sparkles, Layers } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    const [nextPosts, nextAccounts] = await Promise.all([fetchPosts(token), fetchAccounts(token)]);
    setPosts(nextPosts);
    setAccounts(nextAccounts.accounts);
  };

  useEffect(() => {
    if (!token) return;
    load().catch((err) => setError(err.message));
  }, [token]);

  const scheduled = posts.filter((p) => p.status === 'scheduled');
  const published = posts.filter((p) => p.status === 'published');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/50 border border-indigo-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> SocialFlow
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Creator'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              {scheduled.length} post{scheduled.length === 1 ? '' : 's'} waiting for the scheduler.
              Connect accounts and publish from Compose — nothing here is mocked.
            </p>
          </div>
          <Link
            href="/compose"
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </Link>
        </div>
      </div>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Queued</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold">{scheduled.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold">{published.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Connected accounts</span>
            <Share2 className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold">{accounts.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Upcoming queue
          </h3>
          <Link href="/calendar" className="text-xs text-indigo-500 hover:underline">
            View calendar
          </Link>
        </div>
        {scheduled.length === 0 ? (
          <div className="p-6 text-center rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No scheduled posts. Create one from Compose.
          </div>
        ) : (
          scheduled.map((post) => (
            <ScheduledCard
              key={post.id}
              post={post}
              onDelete={async (id) => {
                if (!token) return;
                await deletePost(token, id);
                setPosts((current) => current.filter((p) => p.id !== id));
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
