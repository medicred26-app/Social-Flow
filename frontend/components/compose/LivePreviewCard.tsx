'use client';

import React, { useState } from 'react';
import { SocialPlatform, MediaItem } from '@/types';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { Heart, MessageCircle, Share2, Repeat2, Bookmark, MoreHorizontal, ThumbsUp, Globe } from 'lucide-react';

interface LivePreviewCardProps {
  caption: string;
  media: MediaItem[];
  selectedPlatforms: SocialPlatform[];
}

export function LivePreviewCard({ caption, media, selectedPlatforms }: LivePreviewCardProps) {
  const activePlatforms = selectedPlatforms.length > 0 ? selectedPlatforms : (['x', 'instagram', 'facebook', 'linkedin'] as SocialPlatform[]);
  const [activeTab, setActiveTab] = useState<SocialPlatform>(activePlatforms[0]);

  const currentTab = activePlatforms.includes(activeTab) ? activeTab : activePlatforms[0];
  const config = PLATFORM_CONFIGS[currentTab];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>Live Channel Preview</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-400 font-medium">Real-time</span>
        </h3>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {activePlatforms.map((p) => {
            const isTabActive = currentTab === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setActiveTab(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  isTabActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulated Device Frame Container */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 max-w-lg mx-auto shadow-inner">
        {/* Render Preview according to activeTab platform */}

        {currentTab === 'x' && (
          <div className="text-slate-100 font-sans space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Alex"
                  className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">Alex Morgan ⚡</span>
                    <span className="text-slate-500 text-xs">@alexm_tech · Now</span>
                  </div>
                  <p className="text-xs text-slate-400">Software Architect & Creator</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </div>

            <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
              {caption || 'Your X tweet caption will appear here...'}
            </p>

            {media.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-64 bg-black">
                {media[0].type === 'video' ? (
                  <video src={media[0].url} controls className="w-full h-full object-cover max-h-64" />
                ) : (
                  <img src={media[0].url} alt="Media" className="w-full h-full object-cover max-h-64" />
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-slate-500 text-xs pt-2 border-t border-slate-900">
              <span className="flex items-center gap-1.5 hover:text-indigo-400"><MessageCircle className="w-4 h-4" /> 12</span>
              <span className="flex items-center gap-1.5 hover:text-emerald-400"><Repeat2 className="w-4 h-4" /> 48</span>
              <span className="flex items-center gap-1.5 hover:text-pink-400"><Heart className="w-4 h-4" /> 312</span>
              <span className="flex items-center gap-1.5 hover:text-indigo-400"><Bookmark className="w-4 h-4" /></span>
              <span className="flex items-center gap-1.5 hover:text-indigo-400"><Share2 className="w-4 h-4" /></span>
            </div>
          </div>
        )}

        {currentTab === 'instagram' && (
          <div className="text-slate-100 font-sans space-y-3 bg-slate-900 rounded-2xl border border-slate-800 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
                    alt="Brand"
                    className="w-8 h-8 rounded-full border border-slate-900 object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">techpulse.daily</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Original Audio</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-950 aspect-square flex items-center justify-center border border-slate-800">
              {media.length > 0 ? (
                media[0].type === 'video' ? (
                  <video src={media[0].url} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={media[0].url} alt="Media" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="text-center p-6 text-slate-500 text-xs">
                  Upload an image or video to see full Instagram feed preview
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-200">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 hover:text-pink-500" />
                  <MessageCircle className="w-5 h-5 hover:text-indigo-400" />
                  <Share2 className="w-5 h-5 hover:text-indigo-400" />
                </div>
                <Bookmark className="w-5 h-5" />
              </div>

              <p className="text-xs font-bold text-slate-200">1,480 likes</p>

              <div className="text-xs text-slate-300">
                <span className="font-bold text-white mr-1.5">techpulse.daily</span>
                <span className="whitespace-pre-wrap">{caption || 'Your caption goes here...'}</span>
              </div>
            </div>
          </div>
        )}

        {(currentTab === 'facebook' || currentTab === 'linkedin') && (
          <div className="text-slate-100 font-sans space-y-3 bg-slate-900 rounded-2xl border border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
                alt="TechPulse"
                className="w-10 h-10 rounded-full border border-slate-700 object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  TechPulse Official
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-[9px] text-white flex items-center justify-center font-bold">✓</span>
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>Just now</span> · <Globe className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {caption || `Your ${config.displayName} post text will appear here...`}
            </p>

            {media.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-60 bg-black">
                {media[0].type === 'video' ? (
                  <video src={media[0].url} controls className="w-full h-full object-cover max-h-60" />
                ) : (
                  <img src={media[0].url} alt="Media" className="w-full h-full object-cover max-h-60" />
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-slate-400 text-xs pt-3 border-t border-slate-800/80">
              <button className="flex items-center gap-1.5 hover:text-blue-400 font-medium">
                <ThumbsUp className="w-4 h-4" /> Like
              </button>
              <button className="flex items-center gap-1.5 hover:text-slate-200 font-medium">
                <MessageCircle className="w-4 h-4" /> Comment
              </button>
              <button className="flex items-center gap-1.5 hover:text-slate-200 font-medium">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        )}

        {currentTab === 'youtube' && (
          <div className="text-slate-100 font-sans space-y-3 bg-slate-900 rounded-2xl border border-slate-800 p-4">
            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              {media.length > 0 ? (
                media[0].type === 'video' ? (
                  <video src={media[0].url} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={media[0].url} alt="Media" className="w-full h-full object-cover" />
                )
              ) : (
                <span className="text-xs text-slate-500">Video Thumbnail Preview</span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white line-clamp-1">{caption.split('\n')[0] || 'YouTube Video Title Preview'}</h4>
            <p className="text-xs text-slate-400 line-clamp-2">{caption || 'Video description text...'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
