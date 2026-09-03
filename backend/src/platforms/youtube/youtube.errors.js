export class YouTubeError extends Error {
  constructor(message, code = 500, ytErrorCode = null) {
    super(message);
    this.name = 'YouTubeError';
    this.code = code;
    this.ytErrorCode = ytErrorCode;
  }
}

export function parseYouTubeApiError(data) {
  if (data?.error) {
    return new YouTubeError(
      data.error.message || 'YouTube Data API request failed',
      400,
      data.error.code || null
    );
  }
  return null;
}
