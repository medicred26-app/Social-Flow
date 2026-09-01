import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { decryptSecret, encryptSecret } from '@/lib/crypto';
import { getPlatformCredentials } from './platform-env';
import { SocialPlatform } from '@/types';

type AccountRecord = {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  external_id: string;
  name: string | null;
  access_token_encrypted: string;
  refresh_token_encrypted: string | null;
  token_expires_at: string | null;
  extra: Record<string, unknown> | null;
};

type PublishInput = {
  caption: string;
  mediaUrl?: string | null;
  mediaType?: 'image' | 'video' | null;
};

function assertNoMock(token: string) {
  if (!token || token.startsWith('mock_') || token.includes('sf_jwt')) {
    throw new Error('No valid platform token stored. Reconnect the account.');
  }
}

async function readJson(res: Response) {
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const message =
      data.error_description ||
      data.error?.message ||
      data.detail ||
      data.title ||
      data.message ||
      (typeof data.error === 'string' ? data.error : null) ||
      text ||
      `HTTP ${res.status}`;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return data;
}

async function refreshIfNeeded(supabase: SupabaseClient, account: AccountRecord) {
  if (!account.token_expires_at) return decryptSecret(account.access_token_encrypted);
  const expires = new Date(account.token_expires_at).getTime();
  if (expires - Date.now() > 60_000) {
    return decryptSecret(account.access_token_encrypted);
  }
  if (!account.refresh_token_encrypted) {
    return decryptSecret(account.access_token_encrypted);
  }

  const refreshToken = decryptSecret(account.refresh_token_encrypted);
  let accessToken = '';
  let newRefresh = account.refresh_token_encrypted;
  let expiresAt = account.token_expires_at;

  if (account.platform === 'x') {
    const { clientId, clientSecret } = getPlatformCredentials('x');
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const res = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });
    const data = await readJson(res);
    accessToken = data.access_token;
    if (data.refresh_token) newRefresh = encryptSecret(data.refresh_token);
    if (data.expires_in) expiresAt = new Date(Date.now() + Number(data.expires_in) * 1000).toISOString();
  } else if (account.platform === 'youtube') {
    const { clientId, clientSecret } = getPlatformCredentials('youtube');
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });
    const data = await readJson(res);
    accessToken = data.access_token;
    if (data.expires_in) expiresAt = new Date(Date.now() + Number(data.expires_in) * 1000).toISOString();
  } else if (account.platform === 'linkedin') {
    const { clientId, clientSecret } = getPlatformCredentials('linkedin');
    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    const data = await readJson(res);
    accessToken = data.access_token;
    if (data.expires_in) expiresAt = new Date(Date.now() + Number(data.expires_in) * 1000).toISOString();
  } else {
    return decryptSecret(account.access_token_encrypted);
  }

  assertNoMock(accessToken);
  await supabase
    .from('connected_accounts')
    .update({
      access_token_encrypted: encryptSecret(accessToken),
      refresh_token_encrypted: newRefresh,
      token_expires_at: expiresAt,
    })
    .eq('id', account.id);

  return accessToken;
}

async function publishFacebook(token: string, account: AccountRecord, input: PublishInput) {
  const pageId = (account.extra?.pageId as string) || account.external_id;
  if (input.mediaUrl && (input.mediaType || 'image') === 'image') {
    const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: input.mediaUrl,
        caption: input.caption,
        access_token: token,
      }),
    });
    const data = await readJson(res);
    return data.post_id || data.id;
  }
  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: input.caption,
      link: input.mediaUrl || undefined,
      access_token: token,
    }),
  });
  const data = await readJson(res);
  return data.id;
}

async function publishInstagram(token: string, account: AccountRecord, input: PublishInput) {
  if (!input.mediaUrl) {
    throw new Error('Instagram needs a photo or video uploaded from your device.');
  }
  const igUserId = (account.extra?.igUserId as string) || account.external_id;
  const isVideo = input.mediaType === 'video' || /\.(mp4|mov|webm)(\?|$)/i.test(input.mediaUrl);
  const containerRes = await fetch(`https://graph.facebook.com/v21.0/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      caption: input.caption,
      access_token: token,
      ...(isVideo ? { media_type: 'REELS', video_url: input.mediaUrl } : { image_url: input.mediaUrl }),
    }),
  });
  const container = await readJson(containerRes);
  const publishRes = await fetch(`https://graph.facebook.com/v21.0/${igUserId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: container.id,
      access_token: token,
    }),
  });
  const published = await readJson(publishRes);
  return published.id;
}

async function publishLinkedIn(token: string, account: AccountRecord, input: PublishInput) {
  const author = (account.extra?.personUrn as string) || `urn:li:person:${account.external_id}`;
  const payload: Record<string, unknown> = {
    author,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: input.caption },
        shareMediaCategory: input.mediaUrl ? 'ARTICLE' : 'NONE',
        ...(input.mediaUrl
          ? {
              media: [
                {
                  status: 'READY',
                  originalUrl: input.mediaUrl,
                },
              ],
            }
          : {}),
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };
  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(payload),
  });
  const data = await readJson(res);
  return data.id;
}

async function publishX(token: string, input: PublishInput) {
  const res = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: input.caption }),
  });
  const data = await readJson(res);
  return data.data?.id;
}

async function publishYouTube(token: string, input: PublishInput) {
  if (!input.mediaUrl) {
    throw new Error('YouTube needs a video uploaded from your device.');
  }
  const mediaRes = await fetch(input.mediaUrl);
  if (!mediaRes.ok) {
    throw new Error(`Could not download the provided video URL (${mediaRes.status}).`);
  }
  const contentType = mediaRes.headers.get('content-type') || 'video/mp4';
  if (!contentType.startsWith('video/')) {
    throw new Error('YouTube publish needs a video URL, not an image.');
  }
  const buffer = Buffer.from(await mediaRes.arrayBuffer());
  const title = input.caption.split('\n')[0].slice(0, 100) || 'SocialFlow upload';

  const init = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': contentType,
        'X-Upload-Content-Length': String(buffer.length),
      },
      body: JSON.stringify({
        snippet: { title, description: input.caption },
        status: { privacyStatus: 'public' },
      }),
    }
  );
  if (!init.ok) {
    const err = await init.text();
    throw new Error(err || `YouTube upload init failed (${init.status})`);
  }
  const uploadUrl = init.headers.get('location');
  if (!uploadUrl) {
    throw new Error('YouTube did not return a resumable upload URL.');
  }
  const upload = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(buffer.length),
    },
    body: buffer,
  });
  const data = await readJson(upload);
  return data.id;
}

export async function publishToAccount(
  supabase: SupabaseClient,
  account: AccountRecord,
  input: PublishInput
) {
  const token = await refreshIfNeeded(supabase, account);
  assertNoMock(token);

  if (account.platform === 'facebook') return publishFacebook(token, account, input);
  if (account.platform === 'instagram') return publishInstagram(token, account, input);
  if (account.platform === 'linkedin') return publishLinkedIn(token, account, input);
  if (account.platform === 'x') return publishX(token, input);
  return publishYouTube(token, input);
}

export async function publishPostById(supabase: SupabaseClient, postId: string, userId?: string) {
  let postQuery = supabase.from('posts').select('*').eq('id', postId);
  if (userId) postQuery = postQuery.eq('user_id', userId);
  const { data: post, error: postError } = await postQuery.single();
  if (postError || !post) {
    throw new Error(postError?.message || 'Post not found.');
  }

  const { data: targets, error: targetError } = await supabase
    .from('post_targets')
    .select('*')
    .eq('post_id', postId);
  if (targetError) throw new Error(targetError.message);

  await supabase.from('posts').update({ status: 'publishing' }).eq('id', postId);

  const results = [];
  for (const target of targets || []) {
    if (target.status === 'published') {
      results.push({ accountId: target.account_id, success: true, platformPostId: target.platform_post_id });
      continue;
    }

    const { data: account, error: accountError } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('id', target.account_id)
      .single();

    if (accountError || !account) {
      const error = accountError?.message || 'Connected account missing. Reconnect it.';
      await supabase
        .from('post_targets')
        .update({
          status: 'failed',
          error,
          attempt_count: (target.attempt_count || 0) + 1,
        })
        .eq('id', target.id);
      results.push({ accountId: target.account_id, success: false, error });
      continue;
    }

    try {
      const platformPostId = await publishToAccount(supabase, account as AccountRecord, {
        caption: post.caption,
        mediaUrl: post.media_url,
        mediaType: post.media_type,
      });
      if (!platformPostId) {
        throw new Error('Platform did not return a post ID.');
      }
      await supabase
        .from('post_targets')
        .update({
          status: 'published',
          platform_post_id: platformPostId,
          published_at: new Date().toISOString(),
          error: null,
          attempt_count: (target.attempt_count || 0) + 1,
        })
        .eq('id', target.id);
      results.push({ accountId: target.account_id, success: true, platformPostId });
    } catch (err: any) {
      const error = err?.message || `Failed to publish to ${account.platform}`;
      await supabase
        .from('post_targets')
        .update({
          status: 'failed',
          error,
          attempt_count: (target.attempt_count || 0) + 1,
        })
        .eq('id', target.id);
      results.push({ accountId: target.account_id, success: false, error });
    }
  }

  const allPublished = results.length > 0 && results.every((r) => r.success);
  const anyPublished = results.some((r) => r.success);
  const nextStatus = allPublished ? 'published' : anyPublished ? 'failed' : 'failed';
  await supabase.from('posts').update({ status: nextStatus }).eq('id', postId);

  return { results, status: nextStatus };
}

export async function processDuePosts(supabase: SupabaseClient) {
  const now = new Date().toISOString();
  const { data: due, error } = await supabase
    .from('posts')
    .select('id')
    .eq('status', 'scheduled')
    .lte('scheduled_for', now)
    .limit(25);

  if (error) throw new Error(error.message);

  const processed = [];
  for (const row of due || []) {
    processed.push(await publishPostById(supabase, row.id));
  }
  return { count: processed.length, processed };
}
