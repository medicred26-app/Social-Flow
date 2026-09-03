export const INSTAGRAM_CONFIG = {
  platformId: 'instagram',
  displayName: 'Instagram Business',
  graphApiVersion: 'v19.0',
  baseUrl: 'https://graph.facebook.com/v19.0',
  oauthDialogUrl: process.env.INSTAGRAM_OAUTH_DIALOG_URL || 'https://www.instagram.com/oauth/authorize',
  get appId() {
    return process.env.INSTAGRAM_APP_ID || process.env.META_APP_ID || '';
  },
  get appSecret() {
    return process.env.INSTAGRAM_APP_SECRET || process.env.META_APP_SECRET || '';
  },
  get redirectUri() {
    return process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:5000/api/platforms/instagram/oauth/callback';
  },
  defaultScope: process.env.INSTAGRAM_SCOPE || 'instagram_business_basic,instagram_business_content_publish,instagram_business_manage_messages,instagram_business_manage_comments',
  maxCaptionLength: 2200,
  maxHashtags: 30,
  supportedMedia: ['image', 'video']
};
