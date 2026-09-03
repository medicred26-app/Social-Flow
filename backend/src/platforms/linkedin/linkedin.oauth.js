export function buildLinkedInAuthUrl() {
  return 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=' + (process.env.LINKEDIN_CLIENT_ID || '') + '&scope=w_member_social%20r_liteprofile';
}
