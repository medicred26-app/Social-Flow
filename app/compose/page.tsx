'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SocialAccount, SocialPlatform } from '@/types';
import { createPost, fetchAccounts } from '@/lib/data/api';
import { useAuth } from '@/lib/auth-context';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { PlatformSelector } from '@/components/compose/PlatformSelector';
import { CaptionBox } from '@/components/compose/CaptionBox';
import { MediaUploader } from '@/components/compose/MediaUploader';
import { LivePreviewCard } from '@/components/compose/LivePreviewCard';
import { SchedulePicker } from '@/components/compose/SchedulePicker';
import { PenSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import Link from 'next/link';

export default function ComposePage() {
  const router = useRouter();
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaPath, setMediaPath] = useState<string | null>(null);
  const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const [scheduledDate, setScheduledDate] = useState(tomorrowStr);
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchAccounts(token)
      .then(({ accounts: next }) => {
        setAccounts(next);
        setSelectedAccountIds(next.map((a) => a.id));
      })
      .catch((err) => setNotification({ type: 'error', message: err.message }));
  }, [token]);

  const selectedAccounts = accounts.filter((a) => selectedAccountIds.includes(a.id));
  const selectedPlatforms = Array.from(new Set(selectedAccounts.map((a) => a.platform))) as SocialPlatform[];
  const missingMedia = selectedPlatforms.some((p) => PLATFORM_CONFIGS[p].requiresMedia) && !mediaUrl.trim();
  const canSubmit = selectedAccountIds.length > 0 && caption.trim().length > 0 && !missingMedia;

  const submit = async (publishNow: boolean) => {
    if (!canSubmit || !token) return;
    setIsSubmitting(true);
    setNotification(null);
    try {
      const scheduledIso = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
      const result = await createPost(token, {
        caption,
        accountIds: selectedAccountIds,
        publishNow,
        scheduledFor: scheduledIso,
        mediaUrl: mediaUrl.trim() || undefined,
        mediaType,
      });

      if (publishNow) {
        const failed = (result.results || []).filter((r: any) => !r.success);
        if (failed.length && !result.success) {
          setNotification({
            type: 'error',
            message: failed.map((f: any) => f.error).join(' '),
          });
          setIsSubmitting(false);
          return;
        }
        if (failed.length) {
          setNotification({
            type: 'error',
            message: `Published to some channels. Failed: ${failed.map((f: any) => f.error).join(' ')}`,
          });
        } else {
          setNotification({ type: 'success', message: 'Published to the selected channels.' });
        }
      } else {
        setNotification({ type: 'success', message: `Scheduled for ${scheduledDate} at ${scheduledTime}.` });
      }

      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Could not save the post.' });
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-2xl">
            <PenSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Compose Post</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Write a caption and upload a photo or video from your device.
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">Connect a social account before composing.</p>
          <Link href="/accounts" className="text-xs font-semibold text-indigo-500 hover:underline">
            Go to Accounts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <PlatformSelector
              accounts={accounts}
              selectedAccountIds={selectedAccountIds}
              onToggleAccount={(id) =>
                setSelectedAccountIds((current) =>
                  current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
                )
              }
            />
            <CaptionBox caption={caption} onChange={setCaption} selectedPlatforms={selectedPlatforms} />
            <MediaUploader
              mediaUrl={mediaUrl}
              mediaType={mediaType}
              storagePath={mediaPath}
              onUploaded={({ url, type, path }) => {
                setMediaUrl(url);
                setMediaType(type);
                setMediaPath(path);
              }}
              onCleared={() => {
                setMediaUrl('');
                setMediaType('image');
                setMediaPath(null);
              }}
              selectedPlatforms={selectedPlatforms}
            />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <LivePreviewCard
              caption={caption}
              media={
                mediaUrl
                  ? [{ id: 'url', url: mediaUrl, type: mediaType, name: 'Uploaded file' }]
                  : []
              }
              selectedPlatforms={selectedPlatforms}
            />
            <SchedulePicker
              scheduledDate={scheduledDate}
              scheduledTime={scheduledTime}
              onDateChange={setScheduledDate}
              onTimeChange={setScheduledTime}
              onPublishNow={() => submit(true)}
              onScheduleLater={() => submit(false)}
              isSubmitting={isSubmitting}
              canSubmit={canSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
