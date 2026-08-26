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

const DEMO_METRICS = [
  { date: 'Aug 14', impressions: 2400, engagement: 420, clicks: 180 },
  { date: 'Aug 15', impressions: 3100, engagement: 580, clicks: 240 },
  { date: 'Aug 16', impressions: 2800, engagement: 490, clicks: 210 },
  { date: 'Aug 17', impressions: 4500, engagement: 890, clicks: 430 },
  { date: 'Aug 18', impressions: 5200, engagement: 1100, clicks: 580 },
  { date: 'Aug 19', impressions: 4820, engagement: 950, clicks: 490 },
  { date: 'Aug 20', impressions: 6400, engagement: 1420, clicks: 760 },
];

export function EngagementChart() {
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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DEMO_METRICS}>
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
      </div>
    </div>
  );
}
