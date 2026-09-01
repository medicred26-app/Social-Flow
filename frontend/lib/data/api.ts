import { Post, SocialAccount, SocialPlatform } from '@/types';

async function parse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

export async function fetchAccounts(): Promise<{
  accounts: SocialAccount[];
  platforms: { platform: SocialPlatform; configured: boolean }[];
}> {
  return parse(await fetch('/api/accounts', { cache: 'no-store' }));
}

export async function fetchPosts(): Promise<Post[]> {
  const data = await parse(await fetch('/api/posts', { cache: 'no-store' }));
  return data.posts;
}

export async function createPost(payload: {
  caption: string;
  accountIds: string[];
  scheduledFor?: string;
  publishNow?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}) {
  return parse(
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );
}

export async function deletePost(id: string) {
  return parse(await fetch(`/api/posts/${id}`, { method: 'DELETE' }));
}

export async function deleteAccount(id: string) {
  return parse(await fetch(`/api/accounts/${id}`, { method: 'DELETE' }));
}

export async function fetchSettingsStatus() {
  return parse(await fetch('/api/settings/status', { cache: 'no-store' }));
}
