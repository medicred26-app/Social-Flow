export class XError extends Error {
  constructor(message, code = 500, detail = null) {
    super(message);
    this.name = 'XError';
    this.code = code;
    this.detail = detail;
  }
}

export function parseXApiError(data) {
  if (data?.detail || data?.errors) {
    const msg = data.detail || (data.errors && data.errors[0]?.message) || 'X API error';
    return new XError(msg, 400, data.detail);
  }
  return null;
}
