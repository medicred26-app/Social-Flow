import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialPlatform } from '../types';

@Injectable()
export class PlatformEnvService {
  constructor(private readonly config: ConfigService) {}

  getAppUrl() {
    return this.config.get<string>('APP_URL') || 'http://localhost:3001';
  }

  getFrontendUrl() {
    return this.config.get<string>('FRONTEND_URL') || 'http://localhost:4000';
  }

  oauthRedirectUri(platform: SocialPlatform) {
    return `${this.getAppUrl()}/api/oauth/${platform}/callback`;
  }

  getPlatformCredentials(platform: SocialPlatform) {
    if (platform === 'facebook' || platform === 'instagram') {
      return {
        clientId: this.config.get<string>('META_APP_ID') || '',
        clientSecret: this.config.get<string>('META_APP_SECRET') || '',
      };
    }
    if (platform === 'linkedin') {
      return {
        clientId: this.config.get<string>('LINKEDIN_CLIENT_ID') || '',
        clientSecret: this.config.get<string>('LINKEDIN_CLIENT_SECRET') || '',
      };
    }
    if (platform === 'x') {
      return {
        clientId: this.config.get<string>('X_CLIENT_ID') || '',
        clientSecret: this.config.get<string>('X_CLIENT_SECRET') || '',
      };
    }
    return {
      clientId: this.config.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: this.config.get<string>('GOOGLE_CLIENT_SECRET') || '',
    };
  }

  isPlatformConfigured(platform: SocialPlatform) {
    const { clientId, clientSecret } = this.getPlatformCredentials(platform);
    return Boolean(clientId && clientSecret);
  }

  configuredPlatforms() {
    return (['facebook', 'instagram', 'linkedin', 'x', 'youtube'] as SocialPlatform[]).map(
      (platform) => ({
        platform,
        configured: this.isPlatformConfigured(platform),
      })
    );
  }
}
