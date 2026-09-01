import { createHash, randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { SocialPlatform } from '@/types';
import { encryptSecret } from '@/lib/crypto';
import { getPlatformCredentials, isPlatformConfigured, oauthRedirectUri } from './platform-env';

const STATE_COOKIE = 'sf_oauth_state';
const VERIFIER_COOKIE = 'sf_oauth_verifier';
const PLATFORM_COOKIE = 'sf_oauth_platform';

export type ConnectedAccountInsert = {
  platform: SocialPlatform;
  external_id: string;
  name: string;
  handle: string;
  avatar_url?: string;
  account_type?: string;
  follower_count?: number;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string | null;
  extra?: Record<string, unknown>;
};

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10,
  };
}

export function setOauthCookies(response: NextResponse, platform: SocialPlatform, state: string, verifier?: string) {
  const options = cookieOptions();
  response.cookies.set(STATE_COOKIE, state, options);
  response.cookies.set(PLATFORM_COOKIE, platform, options);
  if (verifier) {
    response.cookies.set(VERIFIER_COOKIE, verifier, options);
  } else {
    response.cookies.delete(VERIFIER_COOKIE);
  }
  return response;
}

export function clearOauthCookies(response: NextResponse) {
  response.cookies.delete(STATE_COOKIE);
  response.cookies.delete(PLATFORM_COOKIE);
  response.cookies.delete(VERIFIER_COOKIE);
  return response;
}

export function readOauthCookies(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const read = (name: string) => {
    const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : '';
  };
  return {
    state: read(STATE_COOKIE),
    platform: read(PLATFORM_COOKIE) as SocialPlatform | '',
    verifier: read(VERIFIER_COOKIE),
  };
}

function randomState() {
  return randomBytes(24).toString('hex');
}

function pkce() {
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

export function startOauth(platform: SocialPlatform) {
  if (!isPlatformConfigured(platform)) {
    throw new Error(`${platform} is not configured. Add its client ID and secret to frontend/.env.local.`);
  }

  const { clientId } = getPlatformCredentials(platform);
  const redirectUri = oauthRedirectUri(platform);
  const state = randomState();
  let verifier: string | undefined;
  let url: string;

  if (platform === 'facebook') {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      response_type: 'code',
      scope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts',
    });
    url = `https://www.facebook.com/v21.0/dialog/oauth?${params}`;
  } else if (platform === 'instagram') {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      response_type: 'code',
      scope:
        'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish',
    });
    url = `https://www.facebook.com/v21.0/dialog/oauth?${params}`;
  } else if (platform === 'linkedin') {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      scope: 'openid profile email w_member_social',
    });
    url = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  } else if (platform === 'x') {
    const pair = pkce();
    verifier = pair.verifier;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'tweet.read tweet.write users.read offline.access',
      state,
      code_challenge: pair.challenge,
      code_challenge_method: 'S256',
    });
    url = `https://twitter.com/i/oauth2/authorize?${params}`;
  } else {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
      access_type: 'offline',
      prompt: 'consent',
      state,
    });
    url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  return { url, state, verifier };
}

async function readJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data.error_description ||
      data.error?.message ||
      data.message ||
      data.error ||
      `HTTP ${res.status}`;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return data;
}

export async function exchangeAndFetchAccounts(
  platform: SocialPlatform,
  code: string,
  verifier?: string
): Promise<ConnectedAccountInsert[]> {
  const { clientId, clientSecret } = getPlatformCredentials(platform);
  const redirectUri = oauthRedirectUri(platform);

  if (platform === 'facebook' || platform === 'instagram') {
    return exchangeMeta(platform, code, clientId, clientSecret, redirectUri);
  }
  if (platform === 'linkedin') {
    return exchangeLinkedIn(code, clientId, clientSecret, redirectUri);
  }
  if (platform === 'x') {
    return exchangeX(code, clientId, clientSecret, redirectUri, verifier);
  }
  return exchangeYouTube(code, clientId, clientSecret, redirectUri);
}

async function exchangeMeta(
  platform: 'facebook' | 'instagram',
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<ConnectedAccountInsert[]> {
  const tokenRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?${new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    })}`
  );
  const tokenData = await readJson(tokenRes);
  const shortToken = tokenData.access_token as string;

  const longRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?${new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: clientId,
      client_secret: clientSecret,
      fb_exchange_token: shortToken,
    })}`
  );
  const longData = await readJson(longRes);
  const userToken = longData.access_token as string;
  const expiresIn = Number(longData.expires_in || 0);
  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null;

  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name,profile_picture_url,followers_count}&access_token=${encodeURIComponent(userToken)}`
  );
  const pagesData = await readJson(pagesRes);
  const pages: any[] = pagesData.data || [];

  if (platform === 'facebook') {
    if (pages.length === 0) {
      throw new Error('No Facebook Pages found. SocialFlow publishes to Pages, not personal profiles.');
    }
    return pages.map((page) => ({
      platform: 'facebook' as const,
      external_id: page.id,
      name: page.name,
      handle: `@${String(page.name || 'page').toLowerCase().replace(/[^a-z0-9._]/g, '')}`,
      account_type: 'page',
      access_token: page.access_token,
      token_expires_at: expiresAt,
      extra: { pageId: page.id },
    }));
  }

  const igAccounts: ConnectedAccountInsert[] = [];
  for (const page of pages) {
    const ig = page.instagram_business_account;
    if (!ig?.id) continue;
    igAccounts.push({
      platform: 'instagram',
      external_id: ig.id,
      name: ig.name || ig.username || page.name,
      handle: ig.username ? `@${ig.username}` : page.name,
      avatar_url: ig.profile_picture_url,
      account_type: 'business',
      follower_count: ig.followers_count,
      access_token: page.access_token,
      token_expires_at: expiresAt,
      extra: { igUserId: ig.id, pageId: page.id },
    });
  }
  if (igAccounts.length === 0) {
    throw new Error('No Instagram Business account linked to a Facebook Page was found.');
  }
  return igAccounts;
}

async function exchangeLinkedIn(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<ConnectedAccountInsert[]> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const tokenData = await readJson(tokenRes);
  const accessToken = tokenData.access_token as string;
  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + Number(tokenData.expires_in) * 1000).toISOString()
    : null;

  const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const me = await readJson(meRes);
  return [
    {
      platform: 'linkedin',
      external_id: me.sub,
      name: me.name || `${me.given_name || ''} ${me.family_name || ''}`.trim(),
      handle: me.email || me.sub,
      avatar_url: me.picture,
      account_type: 'profile',
      access_token: accessToken,
      refresh_token: tokenData.refresh_token,
      token_expires_at: expiresAt,
      extra: { personUrn: `urn:li:person:${me.sub}` },
    },
  ];
}

async function exchangeX(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  verifier?: string
): Promise<ConnectedAccountInsert[]> {
  if (!verifier) {
    throw new Error('Missing PKCE verifier for X OAuth.');
  }
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
  });
  const tokenData = await readJson(tokenRes);
  const accessToken = tokenData.access_token as string;
  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + Number(tokenData.expires_in) * 1000).toISOString()
    : null;

  const meRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics,username,name', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const me = await readJson(meRes);
  const user = me.data;
  return [
    {
      platform: 'x',
      external_id: user.id,
      name: user.name,
      handle: user.username ? `@${user.username}` : user.id,
      avatar_url: user.profile_image_url,
      account_type: 'profile',
      follower_count: user.public_metrics?.followers_count,
      access_token: accessToken,
      refresh_token: tokenData.refresh_token,
      token_expires_at: expiresAt,
      extra: { username: user.username },
    },
  ];
}

async function exchangeYouTube(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<ConnectedAccountInsert[]> {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const tokenData = await readJson(tokenRes);
  const accessToken = tokenData.access_token as string;
  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + Number(tokenData.expires_in) * 1000).toISOString()
    : null;

  const chRes = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const ch = await readJson(chRes);
  const channel = ch.items?.[0];
  if (!channel) {
    throw new Error('No YouTube channel found for this Google account.');
  }
  return [
    {
      platform: 'youtube',
      external_id: channel.id,
      name: channel.snippet?.title,
      handle: channel.snippet?.customUrl || channel.snippet?.title,
      avatar_url: channel.snippet?.thumbnails?.default?.url,
      account_type: 'channel',
      follower_count: Number(channel.statistics?.subscriberCount || 0),
      access_token: accessToken,
      refresh_token: tokenData.refresh_token,
      token_expires_at: expiresAt,
      extra: { channelId: channel.id },
    },
  ];
}

export function toAccountRows(userId: string, accounts: ConnectedAccountInsert[]) {
  return accounts.map((account) => ({
    user_id: userId,
    platform: account.platform,
    external_id: account.external_id,
    name: account.name,
    handle: account.handle,
    avatar_url: account.avatar_url || null,
    account_type: account.account_type || null,
    follower_count: account.follower_count ?? null,
    access_token_encrypted: encryptSecret(account.access_token),
    refresh_token_encrypted: account.refresh_token ? encryptSecret(account.refresh_token) : null,
    token_expires_at: account.token_expires_at || null,
    extra: account.extra || {},
  }));
}
