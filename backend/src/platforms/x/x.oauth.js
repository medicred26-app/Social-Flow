export function buildXAuthUrl() {
  return 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=' + (process.env.X_CLIENT_ID || '') + '&scope=tweet.read%20tweet.write%20users.read';
}
