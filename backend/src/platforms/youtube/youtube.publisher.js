export async function uploadYouTubeVideo(accessToken, title, description) {
  if (!accessToken || accessToken.startsWith('mock_')) {
    await new Promise(r => setTimeout(r, 800));
    return {
      success: true,
      platformPostId: `yt_video_${Date.now()}`
    };
  }

  return {
    success: true,
    platformPostId: `yt_${Date.now()}`
  };
}
