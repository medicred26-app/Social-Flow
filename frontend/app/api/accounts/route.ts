import { NextResponse } from 'next/server';
import { mapAccount, type AccountRow } from '@/lib/data/mappers';
import { configuredPlatforms } from '@/lib/server/platform-env';
import { requireUser } from '@/lib/server/require-user';

export async function GET() {
  const { supabase, user } = await requireUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Sign in required.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('connected_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    accounts: (data as AccountRow[]).map(mapAccount),
    platforms: configuredPlatforms(),
  });
}
