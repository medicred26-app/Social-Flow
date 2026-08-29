import { xApiClient } from './x.client.js';

export async function publishTweet(bearerToken, caption, mediaIds = []) {
  if (!bearerToken || bearerToken.startsWith('mock_')) {
    await new Promise(r => setTimeout(r, 650));
    return {
      success: true,
      platformPostId: `x_tweet_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };
  }

  const payload = { text: caption };
  if (mediaIds.length > 0) {
    payload.media = { media_ids: mediaIds };
  }

  const data = await xApiClient.post('tweets', bearerToken, payload);
  return {
    success: true,
    platformPostId: data.data?.id
  };
}
