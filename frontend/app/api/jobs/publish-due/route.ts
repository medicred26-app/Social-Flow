import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { processDuePosts } from '@/lib/server/publish';

export async function POST(request: Request) {
  const auth = request.headers.get('authorization') || '';
  const expected = process.env.CRON_SECRET;
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const result = await processDuePosts(createAdminClient());
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
