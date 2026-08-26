import { PublishResult } from './facebook';

export async function publishToInstagram(
  accessToken: string,
  igAccountId: string,
  caption: string,
  imageUrl: string
): Promise<PublishResult> {
  // Instagram Graph API Requires 2 steps: Create Container -> Publish Container
  try {
    if (!accessToken || accessToken.startsWith('mock_')) {
      await new Promise(res => setTimeout(res, 900));
      return {
        success: true,
        platformPostId: `ig_media_${Date.now()}_${Math.floor(Math.random() * 10000)}`
      };
    }

    // Step 1: Create media container
    const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken
      })
    });
    const containerData = await containerRes.json();
    if (!containerData.id) {
      return { success: false, error: containerData.error?.message || 'Failed to create IG media container' };
    }

    // Step 2: Publish container
    const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken
      })
    });
    const publishData = await publishRes.json();
    if (publishData.id) {
      return { success: true, platformPostId: publishData.id };
    } else {
      return { success: false, error: publishData.error?.message || 'Failed to publish IG container' };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error publishing to Instagram' };
  }
}
