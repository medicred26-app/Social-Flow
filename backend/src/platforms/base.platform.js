/**
 * Abstract Base Class for Platform Integrations
 * Every social media platform module MUST inherit from or implement this common interface.
 */
export class BasePlatformService {
  constructor(platformId, displayName) {
    if (new.target === BasePlatformService) {
      throw new TypeError('Cannot construct BasePlatformService instances directly');
    }
    this.platformId = platformId;
    this.displayName = displayName;
  }

  /**
   * Connect an account via OAuth code or access token
   */
  async connect(params) {
    throw new Error(`connect() not implemented for platform ${this.platformId}`);
  }

  /**
   * Publish post to the platform
   */
  async publish(payload) {
    throw new Error(`publish() not implemented for platform ${this.platformId}`);
  }

  /**
   * Disconnect account
   */
  async disconnect(accountId) {
    throw new Error(`disconnect() not implemented for platform ${this.platformId}`);
  }

  /**
   * Refresh OAuth token
   */
  async refreshToken(tokenData) {
    throw new Error(`refreshToken() not implemented for platform ${this.platformId}`);
  }

  /**
   * Validate token health/status
   */
  async validateToken(accessToken) {
    throw new Error(`validateToken() not implemented for platform ${this.platformId}`);
  }
}
