import { Post, PostTarget, SocialAccount, SocialPlatform } from '@/types';

export type AccountRow = {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  external_id: string;
  name: string | null;
  handle: string | null;
  avatar_url: string | null;
  account_type: string | null;
  follower_count: number | null;
  token_expires_at: string | null;
  connected_at: string;
  updated_at: string;
};

export type PostRow = {
  id: string;
  user_id: string;
  caption: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  scheduled_for: string | null;
  status: Post['status'];
  created_at: string;
  updated_at: string;
};

export type TargetRow = {
  id: string;
  post_id: string;
  account_id: string;
  platform: SocialPlatform;
  status: PostTarget['status'];
  platform_post_id: string | null;
  error: string | null;
  published_at: string | null;
  attempt_count: number;
};

export function mapAccount(row: AccountRow): SocialAccount {
  return {
    id: row.id,
    platform: row.platform,
    name: row.name || row.handle || row.platform,
    handle: row.handle || '',
    avatarUrl:
      row.avatar_url ||
      `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(row.platform + row.id)}`,
    connected: true,
    connectedAt: row.connected_at,
    followerCount: row.follower_count ?? undefined,
    accountType: (row.account_type as SocialAccount['accountType']) || undefined,
    tokenExpiresAt: row.token_expires_at,
  };
}

export function mapPost(row: PostRow, targets: TargetRow[] = []): Post {
  return {
    id: row.id,
    caption: row.caption,
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    media: row.media_url
      ? [
          {
            id: `${row.id}-media`,
            url: row.media_url,
            type: row.media_type || 'image',
            name: 'Provided media URL',
          },
        ]
      : [],
    targets: targets.map((t) => ({
      id: t.id,
      platform: t.platform,
      accountId: t.account_id,
      status: t.status,
      publishedAt: t.published_at ?? undefined,
      error: t.error ?? undefined,
      platformPostId: t.platform_post_id ?? undefined,
    })),
    scheduledFor: row.scheduled_for || row.created_at,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
  };
}
