import { FACEBOOK_CONFIG } from './facebook.config.js';
import { parseFacebookApiError, FacebookError } from './facebook.errors.js';

export class FacebookApiClient {
  async get(endpoint, accessToken, params = {}) {
    const query = new URLSearchParams({ ...params, access_token: accessToken });
    const url = `${FACEBOOK_CONFIG.baseUrl}/${endpoint}?${query.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    const error = parseFacebookApiError(data);
    if (error) throw error;
    return data;
  }

  async post(endpoint, accessToken, payload = {}) {
    const url = `${FACEBOOK_CONFIG.baseUrl}/${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, access_token: accessToken })
    });
    const data = await res.json();
    const error = parseFacebookApiError(data);
    if (error) throw error;
    return data;
  }
}

export const facebookApiClient = new FacebookApiClient();
