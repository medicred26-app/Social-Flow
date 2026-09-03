export class InstagramError extends Error {
  constructor(message, code = 500, igErrorCode = null) {
    super(message);
    this.name = 'InstagramError';
    this.code = code;
    this.igErrorCode = igErrorCode;
    this.isContainerFailed = message.toLowerCase().includes('container');
  }
}

export function parseInstagramApiError(data) {
  if (data?.error) {
    return new InstagramError(
      data.error.message || 'Instagram API request failed',
      400,
      data.error.code || null
    );
  }
  return null;
}
