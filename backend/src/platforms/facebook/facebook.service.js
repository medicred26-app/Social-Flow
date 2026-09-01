import { BasePlatformService } from '../base.platform.js';
import { publishToFacebookFeed } from './facebook.publisher.js';
import { buildFacebookAuthUrl, exchangeFacebookCodeForToken } from './facebook.oauth.js';
import { facebookApiClient } from './facebook.client.js';
import { createLogger } from '../../middleware/logger.js';
import { saveConnectedAccount } from '../../shared/utils/dbHelpers.js';

const logger = createLogger('FacebookService');

export class FacebookService extends BasePlatformService {
  constructor() {
    super('facebook', 'Facebook Page');
  }

  getAuthUrl() {
    return buildFacebookAuthUrl();
  }

  async connect(params) {
    try {
      const { code } = params;
      if (!code) {
        throw new Error('Authorization code required to connect Facebook account.');
      }
      const accessToken = await exchangeFacebookCodeForToken(code);
      const profile = await facebookApiClient.get('me', accessToken, { fields: 'id,name,email,picture.type(large)' });
      
      let pages = [];
      try {
        const pagesData = await facebookApiClient.get('me/accounts', accessToken, { fields: 'id,name,fan_count,followers_count,picture' });
        pages = pagesData.data || [];
      } catch (err) {
        logger.warn('Could not fetch Facebook pages list', { error: err.message });
      }

      const accountName = pages.length > 0 ? pages[0].name : (profile.name || 'Facebook Account');
      const followers = pages.length > 0 ? (pages[0].followers_count || pages[0].fan_count || 0) : 0;
      const avatar = pages.length > 0 && pages[0].picture?.data?.url ? pages[0].picture.data.url : (profile.picture?.data?.url || `https://graph.facebook.com/v19.0/${profile.id}/picture?type=large`);

      const accountData = {
        id: pages.length > 0 ? pages[0].id : profile.id,
        name: accountName,
        handle: `@${accountName.toLowerCase().replace(/[^a-z0-9._]/g, '')}`,
        avatar,
        followers,
        accessToken,
        status: 'connected'
      };

      saveConnectedAccount('facebook', accountData);
      logger.info('Connected Facebook account successfully', { name: accountName });
      return { success: true, account: accountData };
    } catch (err) {
      logger.error('Failed to connect Facebook account', err);
      return { success: false, error: err.message };
    }
  }

  async publish(payload) {
    try {
      const { pageId = 'me', accessToken = 'mock_token', caption, mediaUrls = [] } = payload;
      const result = await publishToFacebookFeed(pageId, accessToken, caption, mediaUrls);
      logger.info('Published post to Facebook successfully', { postId: result.platformPostId });
      return result;
    } catch (err) {
      logger.error('Error publishing to Facebook', err);
      return { success: false, error: err.message || 'Failed to publish to Facebook' };
    }
  }

  async disconnect(accountId) {
    logger.info('Disconnected Facebook account', { accountId });
    return { success: true };
  }

  async refreshToken(tokenData) {
    return { success: true, newToken: tokenData };
  }

  async validateToken(accessToken) {
    try {
      if (!accessToken || accessToken === 'mock_token') return { valid: true };
      await facebookApiClient.get('me', accessToken, { fields: 'id' });
      return { valid: true };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  }
}

export const facebookService = new FacebookService();
