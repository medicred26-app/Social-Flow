export * from './facebook/index';

// Legacy helper for backward compatibility
import { facebookAdapter } from './facebook/index';
export async function publishToFacebook(
  accessToken: string,
  pageId: string,
  caption: string,
  mediaUrls: string[] = []
) {
  return facebookAdapter.publish({ caption, mediaUrls, pageId });
}
