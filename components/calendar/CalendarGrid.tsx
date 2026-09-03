'use client';

import React, { useState } from 'react';
import { Post } from '@/types';
import { ScheduledCard } from './ScheduledCard';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import Link from 'next/link';

interface CalendarGridProps {
  posts: Post[];
  onDeletePost?: (id: string) => void;
}

export function CalendarGrid({ posts, onDeletePost }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1)); // Default Aug 2026

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-slate-400">Content Publishing Matrix</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-2.5 py-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/compose"
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </Link>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-center border-b border-slate-800 pb-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayPosts = posts.filter((p) =>
            p.scheduledFor && isSameDay(new Date(p.scheduledFor), day)
          );
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isTodayDay = isToday(day);

          return (
            <div
              key={day.toString()}
              className={`min-h-[120px] p-2 rounded-2xl border transition-all ${
                isTodayDay
                  ? 'bg-indigo-950/20 border-indigo-500/60 ring-1 ring-indigo-500/30'
                  : isCurrentMonth
                  ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  : 'bg-slate-950/20 border-slate-900 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isTodayDay
                      ? 'bg-indigo-600 text-white shadow-md'
                      : isCurrentMonth
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {dayPosts.length > 0 && (
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md">
                    {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 max-h-24 overflow-y-auto">
                {dayPosts.map((post) => (
                  <ScheduledCard key={post.id} post={post} onDelete={onDeletePost} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
