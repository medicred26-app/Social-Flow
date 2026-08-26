export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  error?: string;
}

export async function publishToFacebook(
  accessToken: string,
  pageId: string,
  caption: string,
  mediaUrls: string[] = []
): Promise<PublishResult> {
  // Production Meta Graph API endpoint: https://graph.facebook.com/v19.0/{page_id}/feed
  try {
    if (!accessToken || accessToken.startsWith('mock_')) {
      // Simulated publishing delay
      await new Promise(res => setTimeout(res, 800));
      return {
        success: true,
        platformPostId: `fb_post_${Date.now()}_${Math.floor(Math.random() * 10000)}`
      };
    }

    const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: caption,
        access_token: accessToken,
        link: mediaUrls.length > 0 ? mediaUrls[0] : undefined
      })
    });

    const data = await response.json();
    if (data.id) {
      return { success: true, platformPostId: data.id };
    } else {
      return { success: false, error: data.error?.message || 'Facebook API error' };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error publishing to Facebook' };
  }
}
