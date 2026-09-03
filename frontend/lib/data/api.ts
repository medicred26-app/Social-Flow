import { Post, SocialAccount, SocialPlatform } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function parse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

function authHeaders(token: string, init?: RequestInit): HeadersInit {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (init?.body) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

async function apiFetch(token: string, path: string, init?: RequestInit) {
  if (!token) {
    throw new Error('Sign in required.');
  }
  return fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...authHeaders(token, init),
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
}

export async function fetchAccounts(token: string): Promise<{
  accounts: SocialAccount[];
  platforms: { platform: SocialPlatform; configured: boolean }[];
}> {
  return parse(await apiFetch(token, '/accounts', { cache: 'no-store' }));
}

export async function fetchPosts(token: string): Promise<Post[]> {
  const data = await parse(await apiFetch(token, '/posts', { cache: 'no-store' }));
  return data.posts;
}

export async function createPost(
  token: string,
  payload: {
    caption: string;
    accountIds: string[];
    scheduledFor?: string;
    publishNow?: boolean;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
  }
) {
  return parse(
    await apiFetch(token, '/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  );
}

export async function deletePost(token: string, id: string) {
  return parse(await apiFetch(token, `/posts/${id}`, { method: 'DELETE' }));
}

export async function deleteAccount(token: string, id: string) {
  return parse(await apiFetch(token, `/accounts/${id}`, { method: 'DELETE' }));
}

export async function fetchSettingsStatus(token: string) {
  return parse(await apiFetch(token, '/settings/status', { cache: 'no-store' }));
}

export async function startOAuth(token: string, platform: SocialPlatform): Promise<string> {
  const res = await apiFetch(token, `/oauth/${platform}/start`, { method: 'POST' });
  const data = await parse(res);
  if (!data.url) {
    throw new Error('OAuth start did not return a redirect URL.');
  }
  return data.url as string;
}
