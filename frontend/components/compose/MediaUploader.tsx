'use client';

import React, { useState, useRef } from 'react';
import { MediaItem } from '@/types';
import { Upload, X, Image as ImageIcon, Film, Plus, Trash2, FileCheck, CheckCircle2 } from 'lucide-react';

interface MediaUploaderProps {
  media: MediaItem[];
  onAddMedia: (item: MediaItem) => void;
  onRemoveMedia: (id: string) => void;
}

const PRESET_MEDIA: MediaItem[] = [
  {
    id: 'preset-1',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    name: 'SaaS Analytics Dashboard',
    size: '1.2 MB'
  },
  {
    id: 'preset-2',
    url: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    name: 'Productivity Workstation',
    size: '950 KB'
  },
  {
    id: 'preset-3',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    name: 'Abstract Gradient Art',
    size: '1.8 MB'
  }
];

export function MediaUploader({ media, onAddMedia, onRemoveMedia }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Accept images and videos
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) continue;

      const objectUrl = URL.createObjectURL(file);
      const newItem: MediaItem = {
        id: `upload-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
        url: objectUrl,
        type: isVideo ? 'video' : 'image',
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      onAddMedia(newItem);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  // Drag and Drop Event Handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Media Assets ({media.length})
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">Drag & drop real JPG, PNG, MP4, MOV up to 100MB</span>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative p-4 rounded-3xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20 shadow-2xl scale-[1.01]'
            : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-indigo-500/50'
        }`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Drag Active Overlay Indicator */}
        {isDragging ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3 text-indigo-600 dark:text-indigo-400 animate-pulse">
            <Upload className="w-10 h-10 animate-bounce" />
            <p className="text-sm font-extrabold tracking-wide">Drop images or videos to attach to post!</p>
            <p className="text-xs opacity-80">Supports JPG, PNG, MP4, WebM, QuickTime MOV</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Upload Button Box */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 border border-slate-300 dark:border-slate-800 hover:border-indigo-500 bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all duration-200 group h-32 text-center"
            >
              <Upload className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform mb-1.5" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Upload Assets
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Drag & drop or click</span>
            </button>

            {/* Render Uploaded Media Cards */}
            {media.map((item) => (
              <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 h-32 shadow-sm">
                {item.type === 'video' ? (
                  <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    <video src={item.url} className="w-full h-full object-cover opacity-80" muted preload="metadata" />
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                      <div className="p-2 rounded-full bg-indigo-600/90 text-white shadow-lg">
                        <Film className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-extrabold uppercase text-white mt-1 tracking-wider bg-black/60 px-1.5 py-0.5 rounded">
                        Video
                      </span>
                    </div>
                  </div>
                ) : (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                )}

                {/* Hover Details & Remove Action */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                  <button
                    type="button"
                    onClick={() => onRemoveMedia(item.id)}
                    className="self-end p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-md"
                    title="Remove media"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <div className="truncate text-[10px] text-white font-bold">{item.name}</div>
                    <div className="text-[9px] text-slate-400 font-medium">{item.size}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Demo Sample Assets if empty */}
      {media.length === 0 && (
        <div className="pt-1">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium">Or choose sample demo assets:</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_MEDIA.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onAddMedia(preset)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs transition-colors font-medium"
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>{preset.name}</span>
                <Plus className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
