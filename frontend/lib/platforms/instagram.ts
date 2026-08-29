export * from './instagram/index';

import { instagramAdapter } from './instagram/index';
export async function publishToInstagram(
  accessToken: string,
  igAccountId: string,
  caption: string,
  imageUrl: string
) {
  return instagramAdapter.publish({ caption, mediaUrls: [imageUrl], accountId: igAccountId });
}
