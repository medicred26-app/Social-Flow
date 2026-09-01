import { SocialPlatform, PlatformLimit } from '@/types';

export const PLATFORM_CONFIGS: Record<SocialPlatform, PlatformLimit> = {
  facebook: {
    displayName: 'Facebook Page',
    maxCharacters: 63206,
    supportedMedia: ['image', 'video'],
    maxImages: 10,
    brandColor: '#1877F2',
    bgGradient: 'from-blue-600 to-indigo-700',
    requiresMedia: false,
    mediaHint: 'Optional. Upload a photo or video from your device, or post caption-only.',
  },
  instagram: {
    displayName: 'Instagram Business',
    maxCharacters: 2200,
    supportedMedia: ['image', 'video'],
    maxImages: 10,
    brandColor: '#E4405F',
    bgGradient: 'from-pink-500 via-red-500 to-yellow-500',
    requiresMedia: true,
    mediaHint: 'Instagram needs a photo or video. Upload one from your device.',
  },
  youtube: {
    displayName: 'YouTube Channel',
    maxCharacters: 5000,
    supportedMedia: ['video'],
    maxImages: 0,
    brandColor: '#FF0000',
    bgGradient: 'from-red-600 to-rose-700',
    requiresMedia: true,
    mediaHint: 'YouTube needs a video. Upload an MP4, MOV, or WEBM from your device.',
  },
  linkedin: {
    displayName: 'LinkedIn Profile',
    maxCharacters: 3000,
    supportedMedia: ['image', 'video'],
    maxImages: 9,
    brandColor: '#0A66C2',
    bgGradient: 'from-blue-700 to-cyan-600',
    requiresMedia: false,
    mediaHint: 'Optional. Upload a photo or video from your device, or post caption-only.',
  },
  x: {
    displayName: 'X (Twitter)',
    maxCharacters: 280,
    supportedMedia: ['image', 'video'],
    maxImages: 4,
    brandColor: '#1DA1F2',
    bgGradient: 'from-slate-800 to-slate-950',
    requiresMedia: false,
    mediaHint: 'Optional. Upload a photo or video from your device, or post caption-only.',
  },
};

export const ALL_PLATFORMS: SocialPlatform[] = [
  'facebook',
  'instagram',
  'linkedin',
  'x',
  'youtube',
];
