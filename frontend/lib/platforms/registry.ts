import { SocialPlatform } from '@/types';
import { PlatformAdapter } from './types';
import { facebookAdapter } from './facebook';
import { instagramAdapter } from './instagram';
import { youtubeAdapter } from './youtube';
import { xAdapter } from './x';
import { linkedinAdapter } from './linkedin';

export class FrontendPlatformRegistry {
  private adapters: Map<SocialPlatform, PlatformAdapter> = new Map();

  constructor() {
    this.register(facebookAdapter);
    this.register(instagramAdapter);
    this.register(youtubeAdapter);
    this.register(xAdapter);
    this.register(linkedinAdapter);
  }

  register(adapter: PlatformAdapter) {
    this.adapters.set(adapter.platformId, adapter);
  }

  getAdapter(platform: SocialPlatform): PlatformAdapter {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error(`No independent frontend adapter registered for platform '${platform}'`);
    }
    return adapter;
  }
}

export const platformRegistry = new FrontendPlatformRegistry();
