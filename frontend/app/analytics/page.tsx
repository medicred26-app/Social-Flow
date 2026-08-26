'use client';

import React from 'react';
import { EngagementChart } from '@/components/analytics/EngagementChart';
import { BarChart3, TrendingUp, Users, Heart, Share2, MousePointerClick, ArrowUpRight, Award } from 'lucide-react';

const TOP_POSTS = [
  {
    id: 'top-1',
    title: '🚀 Excited to announce our newest product update! Custom analytics...',
    platform: 'LinkedIn & X',
    impressions: '4,820',
    engagementRate: '8.4%',
    likes: 312,
    shares: 48,
  },
  {
    id: 'top-2',
    title: '💡 Quick tip for content creators: Consistency > Perfection...',
    platform: 'Instagram',
    impressions: '3,100',
    engagementRate: '6.2%',
    likes: 240,
    shares: 21,
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Social Performance Analytics</h1>
            <p className="text-xs text-slate-400">In-depth impression metrics, engagement rates, and top content insights</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">29,220</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +18.4% vs last period
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Engagement Rate</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">7.8%</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +2.1% higher than industry benchmark
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Link Clicks</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">2,890</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +12.3% CTR boost
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Net Audience Growth</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">+1,420</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> New followers
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EngagementChart />
        </div>

        {/* Top Content Spotlight */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Top Performing Content</span>
          </h3>

          <div className="space-y-3">
            {TOP_POSTS.map((p) => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    {p.platform}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">{p.engagementRate} Engagement</span>
                </div>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">{p.title}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>{p.impressions} Impressions</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-500" /> {p.likes}</span>
                  <span className="flex items-center gap-1"><Share2 className="w-3 h-3 text-indigo-400" /> {p.shares}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
