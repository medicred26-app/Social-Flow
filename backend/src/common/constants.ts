import { SocialPlatform } from '../types';

export const PLATFORM_CONFIGS: Record<
  SocialPlatform,
  { requiresMedia: boolean; mediaHint: string }
> = {
  facebook: {
    requiresMedia: false,
    mediaHint: 'Optional. Upload a photo or video from your device, or post caption-only.',
  },
  instagram: {
    requiresMedia: true,
    mediaHint: 'Instagram needs a photo or video. Upload one from your device.',
  },
  youtube: {
    requiresMedia: true,
    mediaHint: 'YouTube needs a video. Upload an MP4, MOV, or WEBM from your device.',
  },
  linkedin: {
    requiresMedia: false,
    mediaHint: 'Optional. Upload a photo or video from your device, or post caption-only.',
  },
  x: {
    requiresMedia: false,
    mediaHint: 'Optional. Upload a photo or video from your device, or post caption-only.',
  },
};
