export * from './youtube/index';

import { youtubeAdapter } from './youtube/index';
export async function publishToYouTube(
  accessToken: string,
  title: string,
  description: string
) {
  return youtubeAdapter.publish({ caption: description, title });
}
