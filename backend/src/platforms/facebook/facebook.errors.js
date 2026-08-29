export class FacebookError extends Error {
  constructor(message, code = 500, fbErrorCode = null) {
    super(message);
    this.name = 'FacebookError';
    this.code = code;
    this.fbErrorCode = fbErrorCode;
    this.isTokenExpired = fbErrorCode === 190 || message.toLowerCase().includes('expired token');
  }
}

export function parseFacebookApiError(data) {
  if (data?.error) {
    return new FacebookError(
      data.error.message || 'Facebook API request failed',
      400,
      data.error.code || null
    );
  }
  return null;
}
