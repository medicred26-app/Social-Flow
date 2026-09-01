import { YOUTUBE_CONFIG } from './youtube.config.js';

export function buildYouTubeAuthUrl() {
  const params = new URLSearchParams({
    client_id: YOUTUBE_CONFIG.clientId,
    redirect_uri: YOUTUBE_CONFIG.redirectUri,
    response_type: 'code',
    scope: YOUTUBE_CONFIG.defaultScope,
    access_type: 'offline',
    prompt: 'consent'
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(code) {
  const params = new URLSearchParams({
    code,
    client_id: YOUTUBE_CONFIG.clientId,
    client_secret: YOUTUBE_CONFIG.clientSecret,
    redirect_uri: YOUTUBE_CONFIG.redirectUri,
    grant_type: 'authorization_code'
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error_description || data.error || 'Failed to exchange authorization code for Google tokens.');
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || null,
    expiresIn: data.expires_in,
    scope: data.scope,
    idToken: data.id_token
  };
}

export async function fetchYouTubeChannelProfile(accessToken) {
  try {
    const url = `${YOUTUBE_CONFIG.baseUrl}/channels?mine=true&part=snippet,statistics`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const channel = data.items[0];
      const snippet = channel.snippet || {};
      const statistics = channel.statistics || {};
      const customUrl = snippet.customUrl ? (snippet.customUrl.startsWith('@') ? snippet.customUrl : `@${snippet.customUrl}`) : `@${snippet.title.replace(/\s+/g, '')}`;

      return {
        channelId: channel.id,
        title: snippet.title || 'YouTube Channel',
        handle: customUrl,
        avatar: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=150&q=80',
        subscriberCount: parseInt(statistics.subscriberCount || '0', 10)
      };
    }
  } catch (err) {
    console.warn('[YouTube OAuth] Failed to fetch channel profile from YouTube Data API:', err.message);
  }

  // Fallback if channel details query fails or account has no channel created yet
  return {
    channelId: `yt_${Date.now()}`,
    title: 'YouTube Studio Channel',
    handle: '@YouTubeStudio',
    avatar: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=150&q=80',
    subscriberCount: 0
  };
}

