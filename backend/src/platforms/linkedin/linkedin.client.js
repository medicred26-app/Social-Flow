import { LINKEDIN_CONFIG } from './linkedin.config.js';
import { parseLinkedInApiError } from './linkedin.errors.js';

export class LinkedInApiClient {
  async post(endpoint, accessToken, payload = {}) {
    const url = `${LINKEDIN_CONFIG.baseUrl}/${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': LINKEDIN_CONFIG.restliVersion
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const error = parseLinkedInApiError(data);
    if (error) throw error;
    return data;
  }
}

export const linkedinApiClient = new LinkedInApiClient();
