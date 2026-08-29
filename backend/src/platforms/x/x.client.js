import { X_CONFIG } from './x.config.js';
import { parseXApiError } from './x.errors.js';

export class XApiClient {
  async post(endpoint, bearerToken, payload = {}) {
    const url = `${X_CONFIG.baseUrl}/${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const error = parseXApiError(data);
    if (error) throw error;
    return data;
  }
}

export const xApiClient = new XApiClient();
