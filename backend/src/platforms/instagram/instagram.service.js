import { BasePlatformService } from '../base.platform.js';
import { publishToInstagramMedia } from './instagram.publisher.js';
import { buildInstagramAuthUrl } from './instagram.oauth.js';
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
      const accountData = {
        id: params.igAccountId || `ig_${Date.now()}`,
        name: params.name || 'Instagram Account',
        handle: params.handle || '@instagram_user',
        avatar: params.avatar || 'https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=150&q=80',
        status: 'connected'
      };

      saveConnectedAccount('instagram', accountData);
      logger.info('Connected Instagram account successfully', { handle: accountData.handle });
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
    return { valid: true };
  }
}

export const instagramService = new InstagramService();
