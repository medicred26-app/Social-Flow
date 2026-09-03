export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'linkedin' | 'x';

export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  name: string;
  handle: string;
  avatarUrl: string;
  connected: boolean;
  connectedAt?: string;
  followerCount?: number;
  accountType?: 'page' | 'profile' | 'channel' | 'business';
  tokenExpiresAt?: string | null;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size?: string;
}

export interface PostTarget {
  id?: string;
  platform: SocialPlatform;
  accountId: string;
  status: 'pending' | 'publishing' | 'published' | 'failed';
  publishedAt?: string;
  error?: string;
  platformPostId?: string;
}

export interface Post {
  id: string;
  caption: string;
  media: MediaItem[];
  mediaUrl?: string | null;
  mediaType?: 'image' | 'video' | null;
  targets: PostTarget[];
  scheduledFor: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface PlatformLimit {
  maxCharacters: number;
  supportedMedia: ('image' | 'video')[];
  maxImages: number;
  displayName: string;
  brandColor: string;
  bgGradient: string;
  requiresMedia: boolean;
  mediaHint: string;
}

export interface EngagementMetric {
  date: string;
  impressions: number;
  engagements: number;
  clicks: number;
  shares: number;
}
