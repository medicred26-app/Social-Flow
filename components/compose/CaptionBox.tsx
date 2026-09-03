'use client';

import React from 'react';
import { SocialPlatform } from '@/types';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { Hash, AlertTriangle, Smile } from 'lucide-react';

interface CaptionBoxProps {
  caption: string;
  onChange: (text: string) => void;
  selectedPlatforms: SocialPlatform[];
}

const EMOJIS = ['🚀', '💡', '🔥', '✨', '🎯', '📈', '⚡', '🎉', '👇', '❤️'];
const POPULAR_HASHTAGS = ['#SocialMedia', '#Marketing', '#SaaS', '#Growth', '#Productivity', '#BuildInPublic'];

export function CaptionBox({ caption, onChange, selectedPlatforms }: CaptionBoxProps) {
  // Compute character limit status for selected platforms
  const platformLimits = selectedPlatforms.map((p) => {
    const config = PLATFORM_CONFIGS[p];
    const remaining = config.maxCharacters - caption.length;
    const isExceeded = remaining < 0;
    return {
      platform: p,
      displayName: config.displayName,
      max: config.maxCharacters,
      remaining,
      isExceeded,
    };
  });

  const hasExceededAny = platformLimits.some((l) => l.isExceeded);

  const handleInsertEmoji = (emoji: string) => {
    onChange(caption + ' ' + emoji);
  };

  const handleInsertHashtag = (tag: string) => {
    if (!caption.includes(tag)) {
      onChange(caption + (caption.endsWith(' ') || caption.endsWith('\n') ? '' : ' ') + tag);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Post Caption
        </label>
        <span className="text-[11px] text-slate-500">{caption.length} characters</span>
      </div>

      {/* Main Textarea */}
      <div className={`relative rounded-2xl border transition-all ${
        hasExceededAny 
          ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/60 ring-1 ring-rose-500/30' 
          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30'
      }`}>
        <textarea
          rows={5}
          value={caption}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What's happening? Write your post caption here or click AI Enhance..."
          className="w-full bg-transparent p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none"
        />

        {/* Emoji Bar & Hashtag Quick Inserts */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800/80 rounded-b-2xl">
          {/* Emojis */}
          <div className="flex items-center gap-1">
            <Smile className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-1" />
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => handleInsertEmoji(e)}
                className="hover:scale-125 transition-transform p-1 text-sm"
              >
                {e}
              </button>
            ))}
          </div>

          {/* Quick Hashtags */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <Hash className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            {POPULAR_HASHTAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleInsertHashtag(tag)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-0.5 rounded-full transition-colors flex-shrink-0 font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Limit Indicators */}
      {selectedPlatforms.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {platformLimits.map((l) => (
            <div
              key={l.platform}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                l.isExceeded
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                  : l.remaining < 30
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              {l.isExceeded && <AlertTriangle className="w-3 h-3 text-rose-500 flex-shrink-0" />}
              <span className="capitalize">{l.platform}:</span>
              <span className="font-bold">{l.remaining}</span> left
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
