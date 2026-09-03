import { INSTAGRAM_CONFIG } from './instagram.config.js';
import { parseInstagramApiError } from './instagram.errors.js';

export class InstagramApiClient {
  async get(endpoint, accessToken, queryParams = {}) {
    const params = new URLSearchParams({ ...queryParams, access_token: accessToken });
    const url = `${INSTAGRAM_CONFIG.baseUrl}/${endpoint}?${params.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    const error = parseInstagramApiError(data);
    if (error) throw error;
    return data;
  }

  async post(endpoint, accessToken, payload = {}) {
    const url = `${INSTAGRAM_CONFIG.baseUrl}/${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, access_token: accessToken })
    });
    const data = await res.json();
    const error = parseInstagramApiError(data);
    if (error) throw error;
    return data;
  }
}

export const instagramApiClient = new InstagramApiClient();
