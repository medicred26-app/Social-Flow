'use client';

import React, { useEffect, useState } from 'react';
import { fetchPosts } from '@/lib/data/api';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const [published, setPublished] = useState(0);
  const [failed, setFailed] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts()
      .then((posts) => {
        setPublished(posts.filter((p) => p.status === 'published').length);
        setFailed(posts.filter((p) => p.status === 'failed').length);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-indigo-600 text-white rounded-2xl">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Publish results</h1>
          <p className="text-xs text-slate-400">
            Counts from your real posts only. Platform impression APIs are not wired yet.
          </p>
        </div>
      </div>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
          <p className="text-xs uppercase text-slate-400 font-bold">Published posts</p>
          <p className="text-2xl font-extrabold text-white mt-2">{published}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
          <p className="text-xs uppercase text-slate-400 font-bold">Failed posts</p>
          <p className="text-2xl font-extrabold text-white mt-2">{failed}</p>
        </div>
      </div>
    </div>
  );
}
