import { PublishResult } from './facebook';

export async function publishToX(
  bearerToken: string,
  caption: string,
  mediaIds: string[] = []
): Promise<PublishResult> {
  // Twitter API v2 POST /2/tweets
  try {
    if (!bearerToken || bearerToken.startsWith('mock_')) {
      await new Promise(res => setTimeout(res, 750));
      return {
        success: true,
        platformPostId: `x_tweet_${Date.now()}_${Math.floor(Math.random() * 10000)}`
      };
    }

    const payload: any = { text: caption };
    if (mediaIds.length > 0) {
      payload.media = { media_ids: mediaIds };
    }

    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.data?.id) {
      return { success: true, platformPostId: data.data.id };
    } else {
      return { success: false, error: data.detail || 'X (Twitter) API error' };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error publishing to X' };
  }
}
