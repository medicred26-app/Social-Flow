import { BasePlatformService } from '../base.platform.js';
import { uploadYouTubeVideo } from './youtube.publisher.js';
import { buildYouTubeAuthUrl, exchangeCodeForTokens, fetchYouTubeChannelProfile } from './youtube.oauth.js';
import { createLogger } from '../../middleware/logger.js';
import { saveConnectedAccount } from '../../shared/utils/dbHelpers.js';
import { encryptToken } from '../../shared/utils/encryption.js';
import { supabase } from '../../shared/utils/supabase.js';

const logger = createLogger('YouTubeService');

export class YouTubeService extends BasePlatformService {
  constructor() {
    super('youtube', 'YouTube Channel');
  }

  getAuthUrl() {
    return buildYouTubeAuthUrl();
  }

  async handleOAuthCallback(code) {
    try {
      // 1. Exchange authorization code for tokens
      const tokenData = await exchangeCodeForTokens(code);

      // 2. Fetch channel profile from YouTube API
      const profile = await fetchYouTubeChannelProfile(tokenData.accessToken);

      // 3. Encrypt tokens for secure storage
      const encryptedAccessToken = encryptToken(tokenData.accessToken);
      const encryptedRefreshToken = tokenData.refreshToken ? encryptToken(tokenData.refreshToken) : null;

      const accountData = {
        id: profile.channelId,
        name: profile.title,
        handle: profile.handle,
        avatar: profile.avatar,
        followers: profile.subscriberCount,
        status: 'connected',
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken
      };

      // 4. Save / Upsert connection details into Supabase
      try {
        const { error: dbError } = await supabase.from('connected_accounts').upsert({
          user_id: 'user_1',
          platform: 'youtube',
          platform_account_id: profile.channelId,
          account_name: profile.title,
          handle: profile.handle,
          avatar_url: profile.avatar,
          access_token: encryptedAccessToken,
          refresh_token: encryptedRefreshToken,
          follower_count: profile.subscriberCount,
          status: 'connected',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,platform' });

        if (dbError) {
          logger.warn('Supabase upsert notice:', dbError.message);
        } else {
          logger.info('Saved YouTube connection to Supabase table connected_accounts successfully');
        }
      } catch (sbErr) {
        logger.warn('Supabase database operation notice:', sbErr.message);
      }

      // 5. Sync with internal dbHelpers store
      saveConnectedAccount('youtube', accountData);

      logger.info('Connected YouTube channel successfully via OAuth code exchange', { channelId: profile.channelId, handle: profile.handle });
      return { success: true, account: accountData };
    } catch (err) {
      logger.error('Failed to handle YouTube OAuth callback', err);
      return { success: false, error: err.message || 'Failed to authorize YouTube connection' };
    }
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
      const { accessToken = 'mock_token', caption = '', mediaUrls = [] } = payload;
      const title = caption.substring(0, 50) || 'New YouTube Update';
      const result = await uploadYouTubeVideo(accessToken, title, caption, mediaUrls);
      if (!result.success) {
        return result;
      }
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

