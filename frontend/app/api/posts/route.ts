import { NextResponse } from 'next/server';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { mapPost, type PostRow, type TargetRow } from '@/lib/data/mappers';
import { requireUser } from '@/lib/server/require-user';
import { publishPostById } from '@/lib/server/publish';
import { SocialPlatform } from '@/types';

export async function GET() {
  const { supabase, user } = await requireUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Sign in required.' }, { status: 401 });
  }

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  const ids = (posts || []).map((p) => p.id);
  const { data: targets } = ids.length
    ? await supabase.from('post_targets').select('*').in('post_id', ids)
    : { data: [] };

  const grouped = new Map<string, TargetRow[]>();
  for (const target of (targets || []) as TargetRow[]) {
    const list = grouped.get(target.post_id) || [];
    list.push(target);
    grouped.set(target.post_id, list);
  }

  return NextResponse.json({
    success: true,
    posts: ((posts || []) as PostRow[]).map((post) => mapPost(post, grouped.get(post.id) || [])),
  });
}

export async function POST(request: Request) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Sign in required.' }, { status: 401 });
  }

  const body = await request.json();
  const caption = String(body.caption || '').trim();
  const accountIds: string[] = body.accountIds || [];
  const publishNow = Boolean(body.publishNow);
  const scheduledFor = body.scheduledFor ? new Date(body.scheduledFor).toISOString() : null;
  const mediaUrl = body.mediaUrl ? String(body.mediaUrl).trim() : null;
  const mediaType = body.mediaType === 'video' ? 'video' : mediaUrl ? 'image' : null;

  if (!caption) {
    return NextResponse.json({ success: false, message: 'Caption is required.' }, { status: 400 });
  }
  if (!accountIds.length) {
    return NextResponse.json({ success: false, message: 'Select at least one connected account.' }, { status: 400 });
  }
  if (mediaUrl && !/^https:\/\//i.test(mediaUrl)) {
    return NextResponse.json(
      { success: false, message: 'Upload a file from your device, then publish. Media must be an HTTPS URL.' },
      { status: 400 }
    );
  }

  const { data: accounts, error: accountError } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('user_id', user.id)
    .in('id', accountIds);

  if (accountError) {
    return NextResponse.json({ success: false, message: accountError.message }, { status: 500 });
  }
  if (!accounts || accounts.length !== accountIds.length) {
    return NextResponse.json(
      { success: false, message: 'One or more selected accounts are not connected.' },
      { status: 400 }
    );
  }

  for (const account of accounts) {
    const config = PLATFORM_CONFIGS[account.platform as SocialPlatform];
    if (config.requiresMedia && !mediaUrl) {
      return NextResponse.json(
        { success: false, message: config.mediaHint },
        { status: 400 }
      );
    }
  }

  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      caption,
      media_url: mediaUrl,
      media_type: mediaType,
      scheduled_for: publishNow ? new Date().toISOString() : scheduledFor,
      status: publishNow ? 'publishing' : 'scheduled',
    })
    .select('*')
    .single();

  if (postError || !post) {
    return NextResponse.json(
      { success: false, message: postError?.message || 'Could not create post.' },
      { status: 500 }
    );
  }

  const targetRows = accounts.map((account) => ({
    post_id: post.id,
    account_id: account.id,
    platform: account.platform,
    status: 'pending',
  }));

  const { error: targetError } = await supabase.from('post_targets').insert(targetRows);
  if (targetError) {
    await supabase.from('posts').delete().eq('id', post.id);
    return NextResponse.json({ success: false, message: targetError.message }, { status: 500 });
  }

  if (publishNow) {
    const published = await publishPostById(supabase, post.id, user.id);
    return NextResponse.json({
      success: published.results.some((r) => r.success),
      postId: post.id,
      status: published.status,
      results: published.results,
    });
  }

  return NextResponse.json({
    success: true,
    postId: post.id,
    status: 'scheduled',
    message: `Scheduled for ${scheduledFor}.`,
  });
}
