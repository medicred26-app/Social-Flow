export const YOUTUBE_CONFIG = {
  platformId: 'youtube',
  displayName: 'YouTube Channel',
  baseUrl: 'https://www.googleapis.com/youtube/v3',
  get clientId() { return process.env.GOOGLE_CLIENT_ID || ''; },
  get clientSecret() { return process.env.GOOGLE_CLIENT_SECRET || ''; },
  get redirectUri() { return process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:5000/api/platforms/youtube/oauth/callback'; },
  defaultScope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly'
};
