import { BasePlatformService } from '../base.platform.js';
import { publishTweet } from './x.publisher.js';
import { buildXAuthUrl } from './x.oauth.js';
import { createLogger } from '../../middleware/logger.js';
import { saveConnectedAccount } from '../../shared/utils/dbHelpers.js';

const logger = createLogger('XService');

export class XService extends BasePlatformService {
  constructor() {
    super('x', 'X (Twitter)');
  }

  getAuthUrl() {
    return buildXAuthUrl();
  }

  async connect(params) {
    try {
      const accountData = {
        id: params.id || `x_${Date.now()}`,
        name: params.name || 'Alex Morgan ⚡',
        handle: params.handle || '@alexm_tech',
        avatar: params.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'connected'
      };

      saveConnectedAccount('x', accountData);
      logger.info('Connected X account successfully', { handle: accountData.handle });
      return { success: true, account: accountData };
    } catch (err) {
      logger.error('Failed to connect X account', err);
      return { success: false, error: err.message };
    }
  }

  async publish(payload) {
    try {
      const { bearerToken = 'mock_token', caption, mediaIds = [] } = payload;
      const result = await publishTweet(bearerToken, caption, mediaIds);
      logger.info('Published Tweet successfully', { postId: result.platformPostId });
      return result;
    } catch (err) {
      logger.error('Error publishing to X', err);
      return { success: false, error: err.message || 'Failed to publish to X' };
    }
  }

  async disconnect(accountId) {
    logger.info('Disconnected X account', { accountId });
    return { success: true };
  }

  async refreshToken(tokenData) {
    return { success: true, newToken: tokenData };
  }

  async validateToken(bearerToken) {
    return { valid: true };
  }
}

export const xService = new XService();
