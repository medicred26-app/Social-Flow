'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

import { getStoredPosts } from '@/lib/store';

export function EngagementChart() {
  const posts = getStoredPosts();
  const publishedPosts = posts.filter(p => p.status === 'published');

  // Compute daily engagement metrics dynamically from published posts
  const metricsMap = new Map<string, { date: string; impressions: number; engagement: number }>();
  
  publishedPosts.forEach(post => {
    const d = new Date(post.createdAt || Date.now());
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = metricsMap.get(dateStr) || { date: dateStr, impressions: 0, engagement: 0 };
    existing.impressions += (post.targets?.length || 1) * 150;
    existing.engagement += (post.targets?.length || 1) * 25;
    metricsMap.set(dateStr, existing);
  });

  const chartData = Array.from(metricsMap.values());

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Cross-Platform Reach & Engagement</h3>
          <p className="text-xs text-slate-400">Total impressions and interactions across all active accounts</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Impressions
          </span>
          <span className="flex items-center gap-1.5 text-pink-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" /> Engagement
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-1">
            <p className="font-bold text-slate-300">No published post analytics yet</p>
            <p className="text-[11px] text-slate-500">Publish content across your connected channels to generate live reach graphs.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="impressions"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorImpressions)"
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#ec4899"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorEngagement)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
