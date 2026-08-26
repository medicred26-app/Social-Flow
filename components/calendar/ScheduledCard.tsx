'use client';

import React from 'react';
import { Post } from '@/types';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { Clock, CheckCircle2, AlertCircle, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ScheduledCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

export function ScheduledCard({ post, onDelete }: ScheduledCardProps) {
  const formattedTime = post.scheduledFor 
    ? format(new Date(post.scheduledFor), 'p') 
    : 'No time set';

  const getStatusBadge = () => {
    switch (post.status) {
      case 'published':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Published
          </span>
        );
      case 'scheduled':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            <Clock className="w-3 h-3" /> Scheduled
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            <FileText className="w-3 h-3" /> Draft
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 shadow-sm dark:shadow-md group relative">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          {post.targets.map((t) => {
            const config = PLATFORM_CONFIGS[t.platform];
            return (
              <span
                key={t.platform}
                className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white font-bold"
                style={{ backgroundColor: config.brandColor }}
                title={config.displayName}
              >
                {t.platform.charAt(0).toUpperCase()}
              </span>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{formattedTime}</span>
        </div>
      </div>

      <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed mb-3">
        {post.caption}
      </p>

      {post.media && post.media.length > 0 && (
        <div className="rounded-xl overflow-hidden mb-3 h-24 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <img src={post.media[0].url} alt="Media preview" className="w-full h-full object-cover" />
        </div>
      )}

      {onDelete && (
        <div className="flex justify-end pt-1 border-t border-slate-100 dark:border-slate-800/60">
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            className="text-[11px] text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
