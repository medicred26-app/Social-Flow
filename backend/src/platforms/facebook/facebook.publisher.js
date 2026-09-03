import { facebookApiClient } from './facebook.client.js';

export async function publishToFacebookFeed(pageId, accessToken, caption, mediaUrls = []) {
  if (!accessToken || accessToken.startsWith('mock_')) {
    await new Promise(r => setTimeout(r, 600));
    return {
      success: true,
      platformPostId: `fb_post_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };
  }

  const payload = {
    message: caption,
    link: mediaUrls.length > 0 ? mediaUrls[0] : undefined
  };

  const data = await facebookApiClient.post(`${pageId}/feed`, accessToken, payload);
  return {
    success: true,
    platformPostId: data.id
  };
}
