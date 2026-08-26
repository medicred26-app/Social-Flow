'use client';

import React from 'react';
import { MediaItem } from '@/types';
import { Upload, X, Image as ImageIcon, Film, Plus } from 'lucide-react';

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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const objectUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      const newItem: MediaItem = {
        id: `upload-${Date.now()}-${i}`,
        url: objectUrl,
        type: isVideo ? 'video' : 'image',
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      onAddMedia(newItem);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Media Assets ({media.length})
        </label>
        <span className="text-[11px] text-slate-400">JPG, PNG, MP4 up to 100MB</span>
      </div>

      {/* Upload Box & Previews */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Upload Button */}
        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-800/30 rounded-2xl cursor-pointer transition-all duration-200 group h-32">
          <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors mb-1" />
          <span className="text-xs font-medium text-slate-300 group-hover:text-white">Upload File</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Drag & drop or browse</span>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Existing Uploaded Media Cards */}
        {media.map((item) => (
          <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-32">
            {item.type === 'video' ? (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <Film className="w-8 h-8 text-indigo-400" />
              </div>
            ) : (
              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
              <button
                type="button"
                onClick={() => onRemoveMedia(item.id)}
                className="self-end p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="truncate text-[10px] text-slate-200 font-medium">{item.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Demo Stock Presets */}
      {media.length === 0 && (
        <div className="pt-2">
          <p className="text-[11px] text-slate-400 mb-2">Or choose from sample demo assets:</p>
          <div className="flex gap-2">
            {PRESET_MEDIA.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onAddMedia(preset)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
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
