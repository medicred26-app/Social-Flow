import { INSTAGRAM_CONFIG } from './instagram.config.js';

export function buildInstagramAuthUrl() {
  if (!INSTAGRAM_CONFIG.appId) {
    throw new Error('INSTAGRAM_APP_ID environment variable is missing.');
  }
  const scope = INSTAGRAM_CONFIG.defaultScope;
  return `${INSTAGRAM_CONFIG.oauthDialogUrl}?client_id=${encodeURIComponent(INSTAGRAM_CONFIG.appId)}&redirect_uri=${encodeURIComponent(INSTAGRAM_CONFIG.redirectUri)}&scope=${scope}&response_type=code`;
}

export async function exchangeInstagramCodeForToken(code) {
  const tokenParams = new URLSearchParams({
    client_id: INSTAGRAM_CONFIG.appId,
    client_secret: INSTAGRAM_CONFIG.appSecret,
    grant_type: 'authorization_code',
    redirect_uri: INSTAGRAM_CONFIG.redirectUri,
    code: code
  });

  // Try Instagram OAuth token endpoint first, fallback to Graph API endpoint
  let res = await fetch(`https://api.instagram.com/oauth/access_token`, {
    method: 'POST',
    body: tokenParams
  });

  if (!res.ok) {
    res = await fetch(`${INSTAGRAM_CONFIG.baseUrl}/oauth/access_token?${tokenParams.toString()}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || data.error_message || 'Instagram token exchange failed');
  }

  return data.access_token || data.token;
}
