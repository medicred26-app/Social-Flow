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
