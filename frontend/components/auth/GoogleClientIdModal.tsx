'use client';

import React, { useState } from 'react';
import { Key, CheckCircle2, Copy, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface GoogleClientIdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleClientIdModal({ isOpen, onClose }: GoogleClientIdModalProps) {
  const { googleClientId, setGoogleClientId } = useAuth();
  const [inputVal, setInputVal] = useState(googleClientId || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleClientId(inputVal.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-indigo-500/10 space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Google Console Client ID
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure your Google Cloud OAuth 2.0 Client ID to enable seamless Google Sign-In for SocialFlow.
            </p>
          </div>
        </div>

        {/* Instructions Box */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-2 text-xs text-slate-300">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Quick Setup Steps:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>
              Visit{' '}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline font-medium inline-flex items-center gap-0.5"
              >
                Google Cloud Console Credentials <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Create an OAuth 2.0 Web Client ID.</li>
            <li>
              Add Authorized JavaScript origins:{' '}
              <code className="bg-slate-800 text-indigo-300 px-1 py-0.5 rounded">http://localhost:4000</code>
            </li>
            <li>Copy your Client ID and paste it below or in <code className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded">frontend/.env.local</code>.</li>
          </ol>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Google OAuth 2.0 Client ID
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="1234567890-xyz.apps.googleusercontent.com"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5">
              <CheckCircle2 className="w-4 h-4" />
              Client ID saved successfully! Google Sign-In is now active.
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:opacity-95 transition-opacity"
            >
              Save Client ID
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
