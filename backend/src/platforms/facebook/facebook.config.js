export const FACEBOOK_CONFIG = {
  platformId: 'facebook',
  displayName: 'Facebook Page',
  graphApiVersion: 'v19.0',
  baseUrl: 'https://graph.facebook.com/v19.0',
  oauthDialogUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
  get appId() {
    return process.env.META_APP_ID || '';
  },
  get appSecret() {
    return process.env.META_APP_SECRET || '';
  },
  get redirectUri() {
    return process.env.META_REDIRECT_URI || 'http://localhost:5000/api/platforms/facebook/oauth/callback';
  },
  defaultScope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts'
};
