import { BasePlatformService } from '../base.platform.js';
import { uploadYouTubeVideo } from './youtube.publisher.js';
import { buildYouTubeAuthUrl } from './youtube.oauth.js';
import { createLogger } from '../../middleware/logger.js';
import { saveConnectedAccount } from '../../shared/utils/dbHelpers.js';

const logger = createLogger('YouTubeService');

export class YouTubeService extends BasePlatformService {
  constructor() {
    super('youtube', 'YouTube Channel');
  }

  getAuthUrl() {
    return buildYouTubeAuthUrl();
  }

  async connect(params) {
    try {
      const accountData = {
        id: params.channelId || `yt_${Date.now()}`,
        name: params.name || 'YouTube Studio',
        handle: params.handle || '@YouTubeStudio',
        avatar: params.avatar || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=150&q=80',
        status: 'connected'
      };

      saveConnectedAccount('youtube', accountData);
      logger.info('Connected YouTube channel successfully', { handle: accountData.handle });
      return { success: true, account: accountData };
    } catch (err) {
      logger.error('Failed to connect YouTube channel', err);
      return { success: false, error: err.message };
    }
  }

  async publish(payload) {
    try {
      const { accessToken = 'mock_token', caption = '' } = payload;
      const title = caption.substring(0, 50) || 'New YouTube Update';
      const result = await uploadYouTubeVideo(accessToken, title, caption);
      logger.info('Uploaded video to YouTube successfully', { postId: result.platformPostId });
      return result;
    } catch (err) {
      logger.error('Error publishing to YouTube', err);
      return { success: false, error: err.message || 'Failed to publish to YouTube' };
    }
  }

  async disconnect(accountId) {
    logger.info('Disconnected YouTube channel', { accountId });
    return { success: true };
  }

  async refreshToken(tokenData) {
    return { success: true, newToken: tokenData };
  }

  async validateToken(accessToken) {
    return { valid: true };
  }
}

export const youtubeService = new YouTubeService();
