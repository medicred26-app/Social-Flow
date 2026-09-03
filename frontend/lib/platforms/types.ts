import { SocialPlatform } from '@/types';

export interface SocialPostPayload {
  caption: string;
  mediaUrls?: string[];
  accountId?: string;
  authorUrn?: string;
  pageId?: string;
  title?: string;
}

export interface PlatformActionResult {
  success: boolean;
  platformPostId?: string;
  error?: string;
}

export interface PlatformAdapter {
  platformId: SocialPlatform;
  displayName: string;
  connect(params?: any): Promise<{ success: boolean; account?: any; error?: string }>;
  publish(payload: SocialPostPayload): Promise<PlatformActionResult>;
  disconnect(accountId: string): Promise<{ success: boolean }>;
  refreshToken(token: string): Promise<{ success: boolean; newToken?: string; error?: string }>;
  validateToken(token: string): Promise<{ valid: boolean; error?: string }>;
}
