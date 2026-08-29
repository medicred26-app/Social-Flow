export function buildInstagramAuthUrl() {
  return 'https://www.facebook.com/v19.0/dialog/oauth?client_id=' + (process.env.META_APP_ID || '') + '&scope=instagram_basic,instagram_content_publish';
}
