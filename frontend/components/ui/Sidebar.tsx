'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  PenSquare, 
  Calendar, 
  Share2, 
  BarChart3, 
  Settings, 
  Zap, 
  Sparkles,
  ChevronRight,
  LogOut,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { name: 'Compose', href: '/compose', icon: PenSquare, badge: 'New' },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Accounts', href: '/accounts', icon: Share2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex flex-col justify-between h-screen sticky top-0 z-40 transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/80 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight leading-none flex items-center gap-1.5">
              Social<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase mt-0.5">Automation Suite</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Main Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/10 dark:bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white uppercase shadow-sm">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 text-indigo-600 dark:text-indigo-400' : ''}`} />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Upgrade Banner & User Profile */}
      <div className="p-4 space-y-4 border-t border-slate-200 dark:border-slate-800/80">
        {/* Pro Plan Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-indigo-950/60 dark:via-slate-900 dark:to-purple-950/40 border border-slate-200 dark:border-indigo-800/30 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Express Backend Connected</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2.5">API Server on port 5000 with Google OAuth Client ID.</p>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[85%]" />
          </div>
        </div>

        {/* User Card */}
        {user ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div className="leading-none min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Account</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
