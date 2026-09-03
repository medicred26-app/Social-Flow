export * from './linkedin/index';

import { linkedinAdapter } from './linkedin/index';
export async function publishToLinkedIn(
  accessToken: string,
  authorUrn: string,
  caption: string
) {
  return linkedinAdapter.publish({ caption, authorUrn });
}
