export * from './x/index';

import { xAdapter } from './x/index';
export async function publishToX(
  bearerToken: string,
  caption: string,
  mediaIds: string[] = []
) {
  return xAdapter.publish({ caption });
}
