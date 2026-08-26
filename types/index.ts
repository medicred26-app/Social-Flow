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
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size?: string;
}

export interface PostTarget {
  platform: SocialPlatform;
  accountId: string;
  status: 'pending' | 'published' | 'failed';
  publishedAt?: string;
  error?: string;
  platformPostId?: string;
}

export interface Post {
  id: string;
  caption: string;
  media: MediaItem[];
  targets: PostTarget[];
  scheduledFor: string; // ISO String
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  analytics?: {
    impressions?: number;
    likes?: number;
    shares?: number;
    comments?: number;
    clicks?: number;
  };
}

export interface PlatformLimit {
  maxCharacters: number;
  supportedMedia: ('image' | 'video')[];
  maxImages: number;
  displayName: string;
  brandColor: string;
  bgGradient: string;
}

export interface EngagementMetric {
  date: string;
  impressions: number;
  engagements: number;
  clicks: number;
  shares: number;
}
