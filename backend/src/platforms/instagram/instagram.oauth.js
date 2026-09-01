import { INSTAGRAM_CONFIG } from './instagram.config.js';

export function buildInstagramAuthUrl() {
  if (!INSTAGRAM_CONFIG.appId) {
    throw new Error('INSTAGRAM_APP_ID environment variable is missing.');
  }
  const params = new URLSearchParams({
    client_id: INSTAGRAM_CONFIG.appId,
    redirect_uri: INSTAGRAM_CONFIG.redirectUri,
    scope: INSTAGRAM_CONFIG.defaultScope,
    response_type: 'code'
  });
  return `${INSTAGRAM_CONFIG.oauthDialogUrl}?${params.toString()}`;
}

export async function exchangeInstagramCodeForToken(code) {
  const tokenParams = new URLSearchParams({
    client_id: INSTAGRAM_CONFIG.appId,
    client_secret: INSTAGRAM_CONFIG.appSecret,
    redirect_uri: INSTAGRAM_CONFIG.redirectUri,
    code: code
  });

  const res = await fetch(`${INSTAGRAM_CONFIG.baseUrl}/oauth/access_token?${tokenParams.toString()}`);
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || 'Instagram token exchange failed');
  }

  return data.access_token;
}
