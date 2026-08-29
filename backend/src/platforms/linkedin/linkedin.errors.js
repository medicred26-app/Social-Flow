export class LinkedInError extends Error {
  constructor(message, code = 500, status = null) {
    super(message);
    this.name = 'LinkedInError';
    this.code = code;
    this.status = status;
  }
}

export function parseLinkedInApiError(data) {
  if (data?.message || data?.serviceErrorCode) {
    return new LinkedInError(
      data.message || 'LinkedIn API error',
      data.status || 400,
      data.serviceErrorCode || null
    );
  }
  return null;
}
