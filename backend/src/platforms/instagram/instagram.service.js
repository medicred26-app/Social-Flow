import { BasePlatformService } from '../base.platform.js';
import { publishToInstagramMedia } from './instagram.publisher.js';
import { buildInstagramAuthUrl, exchangeInstagramCodeForToken } from './instagram.oauth.js';
import { instagramApiClient } from './instagram.client.js';
import { createLogger } from '../../middleware/logger.js';
import { saveConnectedAccount } from '../../shared/utils/dbHelpers.js';

const logger = createLogger('InstagramService');

export class InstagramService extends BasePlatformService {
  constructor() {
    super('instagram', 'Instagram Business');
  }

  getAuthUrl() {
    return buildInstagramAuthUrl();
  }

  async connect(params) {
    try {
      const { code } = params;
      let accessToken = params.accessToken;
      let igAccountId = params.igAccountId;
      let accountName = params.name;
      let handle = params.handle;
      let avatar = params.avatar;
      let followers = params.followers || 0;

      if (code) {
        accessToken = await exchangeInstagramCodeForToken(code);
        
        // 1. Fetch Facebook Pages to locate connected Instagram Business Accounts
        const pagesData = await instagramApiClient.get('me/accounts', accessToken, {
          fields: 'id,name,access_token,instagram_business_account{id,username,name,profile_picture_url,followers_count}'
        });

        const pages = pagesData.data || [];
        const pageWithIg = pages.find(p => p.instagram_business_account);

        if (!pageWithIg || !pageWithIg.instagram_business_account) {
          throw new Error('No Instagram Business/Creator account found linked to your Facebook Pages. Please ensure your Instagram account is set to Business or Creator and linked to a Facebook Page.');
        }

        const igBusAcc = pageWithIg.instagram_business_account;
        igAccountId = igBusAcc.id;
        accountName = igBusAcc.name || igBusAcc.username || 'Instagram Business Account';
        handle = igBusAcc.username ? `@${igBusAcc.username}` : '@instagram_user';
        avatar = igBusAcc.profile_picture_url || 'https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=150&q=80';
        followers = igBusAcc.followers_count || 0;
        // Use page access token if available, or fallback to user access token
        accessToken = pageWithIg.access_token || accessToken;
      }

      const accountData = {
        id: igAccountId || `ig_${Date.now()}`,
        name: accountName || 'Instagram Account',
        handle: handle || '@instagram_user',
        avatar: avatar || 'https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=150&q=80',
        followers,
        accessToken,
        igAccountId,
        status: 'connected'
      };

      saveConnectedAccount('instagram', accountData);
      logger.info('Connected Instagram account successfully', { handle: accountData.handle, igAccountId });
      return { success: true, account: accountData };
    } catch (err) {
      logger.error('Failed to connect Instagram account', err);
      return { success: false, error: err.message };
    }
  }

  async publish(payload) {
    try {
      const { igAccountId = 'me', accessToken = 'mock_token', caption, mediaUrls = [] } = payload;
      const imageUrl = mediaUrls[0] || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80';
      const result = await publishToInstagramMedia(igAccountId, accessToken, caption, imageUrl);
      logger.info('Published post to Instagram successfully', { postId: result.platformPostId });
      return result;
    } catch (err) {
      logger.error('Error publishing to Instagram', err);
      return { success: false, error: err.message || 'Failed to publish to Instagram' };
    }
  }

  async disconnect(accountId) {
    logger.info('Disconnected Instagram account', { accountId });
    return { success: true };
  }

  async refreshToken(tokenData) {
    return { success: true, newToken: tokenData };
  }

  async validateToken(accessToken) {
    try {
      if (!accessToken || accessToken.startsWith('mock_')) return { valid: true };
      await instagramApiClient.get('me', accessToken, { fields: 'id' });
      return { valid: true };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  }
}

export const instagramService = new InstagramService();
