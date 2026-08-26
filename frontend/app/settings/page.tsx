'use client';

import React from 'react';
import { Settings, Shield, Key, Cpu, CheckCircle2, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-slate-700 to-slate-900 text-white rounded-2xl shadow-lg border border-slate-700">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">System Settings & API Config</h1>
            <p className="text-xs text-slate-400">Manage Firebase credentials, Cloud Function triggers, and platform client IDs</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {/* Cloud Functions Scheduler Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Firebase Cloud Functions Worker</h3>
              <p className="text-xs text-slate-400">Automated queue publisher cron executor</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Worker Healthy (1m interval)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
          <div>
            <label className="text-[11px] text-slate-500 font-semibold block mb-1">Worker Region</label>
            <input
              type="text"
              readOnly
              value="us-central1 (Google Cloud)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-semibold block mb-1">Execution Trigger</label>
            <input
              type="text"
              readOnly
              value="Cloud Scheduler (Every 1 minute)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Social Platform API Keys Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-2xl">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">OAuth App Secrets & API Keys</h3>
            <p className="text-xs text-slate-400">Optional live keys (Fallback local engine is active)</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Meta / Facebook App ID</label>
            <input
              type="password"
              defaultValue="9823019283019283"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">X (Twitter) Client ID & Secret</label>
            <input
              type="password"
              defaultValue="X_CLIENT_SEC_091823901"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">LinkedIn OAuth Client Secret</label>
            <input
              type="password"
              defaultValue="LINKEDIN_SECRET_89230192"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
