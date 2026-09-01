import { NextResponse } from 'next/server';
import { configuredPlatforms } from '@/lib/server/platform-env';
import { requireUser } from '@/lib/server/require-user';

export async function GET() {
  const { user } = await requireUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Sign in required.' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    encryptionKey: Boolean(process.env.TOKEN_ENCRYPTION_KEY && process.env.TOKEN_ENCRYPTION_KEY.length === 64),
    cronSecret: Boolean(process.env.CRON_SECRET),
    inlineScheduler: process.env.ENABLE_INLINE_SCHEDULER === 'true',
    platforms: configuredPlatforms(),
  });
}
