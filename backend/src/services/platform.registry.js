import { facebookService } from '../platforms/facebook/facebook.service.js';
import { instagramService } from '../platforms/instagram/instagram.service.js';
import { youtubeService } from '../platforms/youtube/youtube.service.js';
import { xService } from '../platforms/x/x.service.js';
import { linkedinService } from '../platforms/linkedin/linkedin.service.js';
import { createLogger } from '../middleware/logger.js';

const logger = createLogger('PlatformRegistry');

export class PlatformRegistry {
  constructor() {
    this.services = new Map();
    this.register(facebookService);
    this.register(instagramService);
    this.register(youtubeService);
    this.register(xService);
    this.register(linkedinService);
  }

  register(service) {
    this.services.set(service.platformId, service);
    logger.info(`Registered independent platform service: ${service.displayName} (${service.platformId})`);
  }

  getService(platformId) {
    const service = this.services.get(platformId.toLowerCase());
    if (!service) {
      throw new Error(`Platform service for '${platformId}' is not registered.`);
    }
    return service;
  }

  /**
   * Safely dispatches a multi-target post across platforms independently.
   * Isolates failures so an error on one platform will not prevent others from publishing.
   */
  /**
   * Safely dispatches a multi-target post across platforms concurrently and independently.
   * Isolates failures completely so an error or outage on one platform will not delay or prevent others from publishing.
   */
  async publishToTargets(targets, caption, mediaUrls = []) {
    const promises = targets.map(async (target) => {
      const platformId = target.platform;
      try {
        const service = this.getService(platformId);
        logger.info(`Dispatching post to ${service.displayName}...`);
        
        const res = await service.publish({
          ...target,
          caption,
          mediaUrls
        });

        return {
          platform: platformId,
          accountId: target.accountId,
          success: Boolean(res.success),
          platformPostId: res.platformPostId || null,
          error: res.error || null
        };
      } catch (err) {
        logger.error(`Isolated failure publishing to platform ${platformId}`, err);
        return {
          platform: platformId,
          accountId: target.accountId,
          success: false,
          error: err.message || `Outage/Error on platform ${platformId}`
        };
      }
    });

    const settledResults = await Promise.allSettled(promises);
    return settledResults.map(item => {
      if (item.status === 'fulfilled') {
        return item.value;
      }
      return {
        platform: 'unknown',
        success: false,
        error: item.reason?.message || 'Platform dispatch failed'
      };
    });
  }
}

export const platformRegistry = new PlatformRegistry();
