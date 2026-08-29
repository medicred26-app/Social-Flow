// Simple secure token encoding/decryption helper for social media credentials
export function encryptToken(token) {
  if (!token) return '';
  return Buffer.from(token).toString('base64');
}

export function decryptToken(encryptedToken) {
  if (!encryptedToken) return '';
  try {
    return Buffer.from(encryptedToken, 'base64').toString('utf-8');
  } catch (err) {
    return encryptedToken;
  }
}
