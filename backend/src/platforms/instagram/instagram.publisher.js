import { instagramApiClient } from './instagram.client.js';

export async function publishToInstagramMedia(igAccountId, accessToken, caption, imageUrl) {
  if (!accessToken || accessToken.startsWith('mock_')) {
    await new Promise(r => setTimeout(r, 700));
    return {
      success: true,
      platformPostId: `ig_media_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };
  }

  // 1. Create Media Container
  const containerData = await instagramApiClient.post(`${igAccountId}/media`, accessToken, {
    image_url: imageUrl,
    caption
  });

  // 2. Publish Container
  const publishData = await instagramApiClient.post(`${igAccountId}/media_publish`, accessToken, {
    creation_id: containerData.id
  });

  return {
    success: true,
    platformPostId: publishData.id
  };
}
