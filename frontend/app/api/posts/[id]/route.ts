import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/require-user';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Sign in required.' }, { status: 401 });
  }

  const { id } = await context.params;
  const { error } = await supabase.from('posts').delete().eq('id', id).eq('user_id', user.id);
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
