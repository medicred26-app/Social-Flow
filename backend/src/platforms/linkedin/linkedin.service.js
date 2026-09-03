import { BasePlatformService } from '../base.platform.js';
import { publishUgcPost } from './linkedin.publisher.js';
import { buildLinkedInAuthUrl } from './linkedin.oauth.js';
import { createLogger } from '../../middleware/logger.js';
import { saveConnectedAccount } from '../../shared/utils/dbHelpers.js';

const logger = createLogger('LinkedInService');

export class LinkedInService extends BasePlatformService {
  constructor() {
    super('linkedin', 'LinkedIn Profile');
  }

  getAuthUrl() {
    return buildLinkedInAuthUrl();
  }

  async connect(params) {
    try {
      const accountData = {
        id: params.urn || `urn:li:person:${Date.now()}`,
        name: params.name || 'Alex Morgan',
        handle: params.handle || 'in/alex-morgan-tech',
        avatar: params.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'connected'
      };

      saveConnectedAccount('linkedin', accountData);
      logger.info('Connected LinkedIn account successfully', { handle: accountData.handle });
      return { success: true, account: accountData };
    } catch (err) {
      logger.error('Failed to connect LinkedIn account', err);
      return { success: false, error: err.message };
    }
  }

  async publish(payload) {
    try {
      const { accessToken = 'mock_token', authorUrn = 'urn:li:person:123', caption } = payload;
      const result = await publishUgcPost(accessToken, authorUrn, caption);
      logger.info('Published UGC Post to LinkedIn successfully', { postId: result.platformPostId });
      return result;
    } catch (err) {
      logger.error('Error publishing to LinkedIn', err);
      return { success: false, error: err.message || 'Failed to publish to LinkedIn' };
    }
  }

  async disconnect(accountId) {
    logger.info('Disconnected LinkedIn account', { accountId });
    return { success: true };
  }

  async refreshToken(tokenData) {
    return { success: true, newToken: tokenData };
  }

  async validateToken(accessToken) {
    return { valid: true };
  }
}

export const linkedinService = new LinkedInService();
