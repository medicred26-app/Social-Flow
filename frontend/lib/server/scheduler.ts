import { createAdminClient } from '@/lib/supabase/admin';
import { processDuePosts } from './publish';

let started = false;

export function startScheduler() {
  if (started) return;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.TOKEN_ENCRYPTION_KEY) {
    console.warn('[SocialFlow] Scheduler not started: SUPABASE_SERVICE_ROLE_KEY or TOKEN_ENCRYPTION_KEY missing.');
    return;
  }
  started = true;
  const tick = async () => {
    try {
      const result = await processDuePosts(createAdminClient());
      if (result.count > 0) {
        console.log(`[SocialFlow] Published ${result.count} due post(s).`);
      }
    } catch (err) {
      console.error('[SocialFlow] Scheduler tick failed:', err);
    }
  };
  void tick();
  setInterval(tick, 30_000);
}
