export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'linkedin' | 'x';

export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}
