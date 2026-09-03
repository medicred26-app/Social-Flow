'use client';

import React, { useState } from 'react';
import { EngagementChart } from '@/components/analytics/EngagementChart';
import { BarChart3, TrendingUp, Users, Heart, Share2, MousePointerClick, ArrowUpRight, Award, Download, FileText, CheckCircle2 } from 'lucide-react';
import { exportAnalyticsCSV, triggerPrintPDF } from '@/lib/analytics-export';
import { getStoredAccounts } from '@/lib/store';
import { SocialAccount } from '@/types';

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

const METRICS_SUMMARY = {
  totalImpressions: '29,220',
  impressionsGrowth: '+18.4% vs last period',
  avgEngagementRate: '7.8%',
  engagementGrowth: '+2.1% higher than benchmark',
  linkClicks: '2,890',
  clicksGrowth: '+12.3% CTR boost',
  audienceGrowth: '+1,420',
  followersGrowth: 'New followers',
};

export default function AnalyticsPage() {
  const [notification, setNotification] = useState<string | null>(null);

  // Compute live metrics dynamically from stored accounts and posts
  const accounts: SocialAccount[] = typeof window !== 'undefined' ? getStoredAccounts() : [];
  const connectedAccounts = accounts.filter((a: SocialAccount) => a.connected);
  const totalFollowers = connectedAccounts.reduce((acc: number, a: SocialAccount) => acc + (a.followerCount || 0), 0);
  const totalImpressionsCount = totalFollowers > 0 ? Math.round(totalFollowers * 1.85) : 29220;

  const metricsSummary = {
    totalImpressions: totalImpressionsCount.toLocaleString(),
    impressionsGrowth: '+18.4% vs last period',
    avgEngagementRate: '7.8%',
    engagementGrowth: '+2.1% higher than benchmark',
    linkClicks: Math.round(totalImpressionsCount * 0.098).toLocaleString(),
    clicksGrowth: '+12.3% CTR boost',
    audienceGrowth: `+${totalFollowers > 0 ? Math.round(totalFollowers * 0.05).toLocaleString() : '1,420'}`,
    followersGrowth: 'New followers',
  };

  const handleExportCSV = () => {
    exportAnalyticsCSV(metricsSummary, TOP_POSTS);
    setNotification('📊 Analytics report exported successfully as CSV file!');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportPDF = () => {
    setNotification('📄 Preparing PDF Report. Printing dialog opening...');
    setTimeout(() => {
      triggerPrintPDF();
      setNotification(null);
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Printable Report Header */}
      <div className="hidden print-only text-slate-900 border-b border-slate-300 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">SocialFlow Performance Report</h1>
            <p className="text-xs text-slate-600">Executive Summary & Channel Metrics · Generated {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-indigo-600">Confidential · Internal Report</span>
          </div>
        </div>
      </div>

      {/* Title Header with Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 no-print">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Social Performance Analytics</h1>
            <p className="text-xs text-slate-400">In-depth impression metrics, engagement rates, and top content insights</p>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification && (
        <div className="no-print p-4 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{metricsSummary.totalImpressions}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> {metricsSummary.impressionsGrowth}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Engagement Rate</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{metricsSummary.avgEngagementRate}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> {metricsSummary.engagementGrowth}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Link Clicks</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{metricsSummary.linkClicks}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> {metricsSummary.clicksGrowth}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Net Audience Growth</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{metricsSummary.audienceGrowth}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> {metricsSummary.followersGrowth}
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
