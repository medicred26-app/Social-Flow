import { YOUTUBE_CONFIG } from './youtube.config.js';
import { parseYouTubeApiError } from './youtube.errors.js';

export class YouTubeApiClient {
  async get(endpoint, accessToken, params = {}) {
    const query = new URLSearchParams(params);
    const url = `${YOUTUBE_CONFIG.baseUrl}/${endpoint}?${query.toString()}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await res.json();
    const error = parseYouTubeApiError(data);
    if (error) throw error;
    return data;
  }
}

export const youtubeApiClient = new YouTubeApiClient();
