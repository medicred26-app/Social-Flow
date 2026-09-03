'use client';

import React, { useRef, useState } from 'react';
import { SocialPlatform } from '@/types';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { removePostMedia, storagePathFromPublicUrl, uploadPostMedia } from '@/lib/storage';
import { useAuth } from '@/lib/auth-context';
import { AlertTriangle, Film, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react';

interface MediaUploaderProps {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  storagePath: string | null;
  onUploaded: (payload: { url: string; type: 'image' | 'video'; path: string }) => void;
  onCleared: () => void;
  selectedPlatforms: SocialPlatform[];
}

export function MediaUploader({
  mediaUrl,
  mediaType,
  storagePath,
  onUploaded,
  onCleared,
  selectedPlatforms,
}: MediaUploaderProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const required = selectedPlatforms.filter((p) => PLATFORM_CONFIGS[p].requiresMedia);
  const missingRequired = required.length > 0 && !mediaUrl.trim();

  const uploadFile = async (file: File | undefined) => {
    if (!file) return;
    if (!user) {
      setError('Sign in to upload media from your device.');
      return;
    }
    setError('');
    setIsUploading(true);
    try {
      if (storagePath) {
        await removePostMedia(storagePath).catch(() => undefined);
      }
      const uploaded = await uploadPostMedia(user.id, file);
      onUploaded({ url: uploaded.url, type: uploaded.type, path: uploaded.path });
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const clearMedia = async () => {
    setError('');
    const path = storagePath || (user ? storagePathFromPublicUrl(mediaUrl, user.id) : null);
    if (path) {
      await removePostMedia(path).catch(() => undefined);
    }
    onCleared();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Media
        </label>
        <span className="text-[11px] text-slate-500">Upload from this device · images 10 MB · videos 100 MB</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={(e) => void uploadFile(e.target.files?.[0])}
      />

      {!mediaUrl ? (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            void uploadFile(e.dataTransfer.files?.[0]);
          }}
          className={`w-full rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-indigo-400'
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 mx-auto text-indigo-500 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 mx-auto text-indigo-500" />
          )}
          <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {isUploading ? 'Uploading…' : 'Click to choose a photo or video'}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Or drag a file from your computer or phone</p>
        </button>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden">
          <div className="relative bg-slate-950 min-h-40 flex items-center justify-center">
            {mediaType === 'video' ? (
              <video src={mediaUrl} controls className="max-h-56 w-full object-contain" />
            ) : (
              <img src={mediaUrl} alt="Selected media" className="max-h-56 w-full object-contain" />
            )}
            <button
              type="button"
              onClick={() => void clearMedia()}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-600 text-white"
              title="Remove media"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              {mediaType === 'video' ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
              Ready to publish
            </span>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
              className="font-semibold text-indigo-500 hover:underline"
            >
              Replace file
            </button>
          </div>
        </div>
      )}

      {(error || missingRequired) && (
        <p className="flex items-start gap-2 text-[11px] text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          {error || required.map((p) => PLATFORM_CONFIGS[p].mediaHint).join(' ')}
        </p>
      )}
    </div>
  );
}
