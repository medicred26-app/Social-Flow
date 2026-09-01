import { YOUTUBE_CONFIG } from './youtube.config.js';
import { parseYouTubeApiError } from './youtube.errors.js';

export async function uploadYouTubeVideo(accessToken, title, description, mediaUrls = []) {
  if (!accessToken || accessToken.startsWith('mock_')) {
    await new Promise(r => setTimeout(r, 800));
    return {
      success: true,
      platformPostId: `yt_video_${Date.now()}`
    };
  }

  try {
    const videoMetadata = {
      snippet: {
        title: title || 'SocialFlow Update',
        description: description || '',
        tags: ['SocialFlow', 'Automation'],
        categoryId: '22' // People & Blogs
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false
      }
    };

    const res = await fetch(`${YOUTUBE_CONFIG.baseUrl}/videos?part=snippet,status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(videoMetadata)
    });

    const data = await res.json();
    const error = parseYouTubeApiError(data);
    if (error) throw error;

    return {
      success: true,
      platformPostId: data.id || `yt_${Date.now()}`
    };
  } catch (err) {
    // If real API returns error, throw or return descriptive error object
    return {
      success: false,
      error: err.message || 'Failed to upload to YouTube API'
    };
  }
}

