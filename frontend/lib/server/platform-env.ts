import { SocialPlatform } from '@/types';
import { getAppUrl } from '@/lib/supabase/env';

export function oauthRedirectUri(platform: SocialPlatform) {
  return `${getAppUrl()}/api/oauth/${platform}/callback`;
}

export function getPlatformCredentials(platform: SocialPlatform) {
  if (platform === 'facebook' || platform === 'instagram') {
    return {
      clientId: process.env.META_APP_ID || '',
      clientSecret: process.env.META_APP_SECRET || '',
    };
  }
  if (platform === 'linkedin') {
    return {
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    };
  }
  if (platform === 'x') {
    return {
      clientId: process.env.X_CLIENT_ID || '',
      clientSecret: process.env.X_CLIENT_SECRET || '',
    };
  }
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  };
}

export function isPlatformConfigured(platform: SocialPlatform) {
  const { clientId, clientSecret } = getPlatformCredentials(platform);
  return Boolean(clientId && clientSecret);
}

export function configuredPlatforms() {
  return (['facebook', 'instagram', 'linkedin', 'x', 'youtube'] as SocialPlatform[]).map(
    (platform) => ({
      platform,
      configured: isPlatformConfigured(platform),
    })
  );
}
