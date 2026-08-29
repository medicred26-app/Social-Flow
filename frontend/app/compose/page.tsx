'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post, SocialAccount, SocialPlatform, MediaItem, PostTarget } from '@/types';
import { getStoredAccounts, getStoredPosts, saveStoredPosts } from '@/lib/store';
import { PlatformSelector } from '@/components/compose/PlatformSelector';
import { CaptionBox } from '@/components/compose/CaptionBox';
import { MediaUploader } from '@/components/compose/MediaUploader';
import { LivePreviewCard } from '@/components/compose/LivePreviewCard';
import { SchedulePicker } from '@/components/compose/SchedulePicker';
import { platformRegistry } from '@/lib/platforms';
import { PenSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';

export default function ComposePage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  
  // Schedule state default tomorrow at 10:00 AM
  const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const [scheduledDate, setScheduledDate] = useState(tomorrowStr);
  const [scheduledTime, setScheduledTime] = useState('10:00');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const accs = getStoredAccounts();
    setAccounts(accs);
    // Pre-select first 3 connected accounts
    const active = accs.filter(a => a.connected).map(a => a.id);
    setSelectedAccountIds(active);
  }, []);

  const handleToggleAccount = (id: string) => {
    if (selectedAccountIds.includes(id)) {
      setSelectedAccountIds(selectedAccountIds.filter(aId => aId !== id));
    } else {
      setSelectedAccountIds([...selectedAccountIds, id]);
    }
  };

  const handleAddMedia = (item: MediaItem) => {
    setMedia([...media, item]);
  };

  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  const selectedAccounts = accounts.filter(a => selectedAccountIds.includes(a.id));
  const selectedPlatforms = Array.from(new Set(selectedAccounts.map(a => a.platform)));

  const canSubmit = selectedAccountIds.length > 0 && caption.trim().length > 0;

  const executePublishFlow = async (isImmediate: boolean) => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setNotification(null);

    const postTargets: PostTarget[] = selectedAccounts.map(acc => ({
      platform: acc.platform,
      accountId: acc.id,
      status: isImmediate ? 'published' : 'pending',
    }));

    if (isImmediate) {
      // Trigger independent platform adapter services with fault isolation
      const mediaUrls = media.map(m => m.url);
      for (const target of postTargets) {
        try {
          const adapter = platformRegistry.getAdapter(target.platform);
          const res = await adapter.publish({
            caption,
            mediaUrls,
            accountId: target.accountId
          });
          if (res.success && res.platformPostId) {
            target.platformPostId = res.platformPostId;
            target.status = 'published';
          } else if (!res.success) {
            target.status = 'failed';
            target.error = res.error;
          }
        } catch (err: any) {
          // Failure on one platform does NOT affect other platforms
          target.status = 'failed';
          target.error = err.message || `Outage on ${target.platform}`;
        }
      }
    }

    const scheduledIso = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();

    const newPost: Post = {
      id: `post-${Date.now()}`,
      caption,
      media,
      targets: postTargets,
      scheduledFor: isImmediate ? new Date().toISOString() : scheduledIso,
      status: isImmediate ? 'published' : 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user-demo',
    };

    const currentPosts = getStoredPosts();
    const updatedPosts = [newPost, ...currentPosts];
    saveStoredPosts(updatedPosts);

    setIsSubmitting(false);
    setNotification({
      type: 'success',
      message: isImmediate
        ? '🚀 Post published successfully across all selected channels!'
        : `📅 Post scheduled for ${scheduledDate} at ${scheduledTime}!`,
    });

    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <PenSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Compose Post</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Craft, preview, and schedule content across multiple social networks</p>
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-lg ${
          notification.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Grid: Left Editor | Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Workbench Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <PlatformSelector
            accounts={accounts}
            selectedAccountIds={selectedAccountIds}
            onToggleAccount={handleToggleAccount}
          />

          <CaptionBox
            caption={caption}
            onChange={setCaption}
            selectedPlatforms={selectedPlatforms}
          />

          <MediaUploader
            media={media}
            onAddMedia={handleAddMedia}
            onRemoveMedia={handleRemoveMedia}
          />
        </div>

        {/* Right Preview & Schedule Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <LivePreviewCard
            caption={caption}
            media={media}
            selectedPlatforms={selectedPlatforms}
          />

          <SchedulePicker
            scheduledDate={scheduledDate}
            scheduledTime={scheduledTime}
            onDateChange={setScheduledDate}
            onTimeChange={setScheduledTime}
            onPublishNow={() => executePublishFlow(true)}
            onScheduleLater={() => executePublishFlow(false)}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
          />
        </div>
      </div>
    </div>
  );
}
