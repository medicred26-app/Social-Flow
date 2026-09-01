export const INSTAGRAM_CONFIG = {
  platformId: 'instagram',
  displayName: 'Instagram Business',
  graphApiVersion: 'v19.0',
  baseUrl: 'https://graph.facebook.com/v19.0',
  oauthDialogUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
  get appId() {
    return process.env.INSTAGRAM_APP_ID || process.env.META_APP_ID || '';
  },
  get appSecret() {
    return process.env.INSTAGRAM_APP_SECRET || process.env.META_APP_SECRET || '';
  },
  get redirectUri() {
    return process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:5000/api/platforms/instagram/oauth/callback';
  },
  defaultScope: process.env.INSTAGRAM_SCOPE || 'public_profile,instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement',
  maxCaptionLength: 2200,
  maxHashtags: 30,
  supportedMedia: ['image', 'video']
};
