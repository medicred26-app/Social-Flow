import { PublishResult } from './facebook';

export async function publishToLinkedIn(
  accessToken: string,
  authorUrn: string,
  caption: string
): Promise<PublishResult> {
  // LinkedIn REST API v2 /v2/ugcPosts
  try {
    if (!accessToken || accessToken.startsWith('mock_')) {
      await new Promise(res => setTimeout(res, 850));
      return {
        success: true,
        platformPostId: `urn:li:share:${Date.now()}`
      };
    }

    const body = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: caption },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.id) {
      return { success: true, platformPostId: data.id };
    } else {
      return { success: false, error: data.message || 'LinkedIn API error' };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error publishing to LinkedIn' };
  }
}
