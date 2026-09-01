import { NextResponse } from 'next/server';
import { SocialPlatform } from '@/types';
import { requireUser } from '@/lib/server/require-user';
import { setOauthCookies, startOauth } from '@/lib/server/oauth';

const PLATFORMS: SocialPlatform[] = ['facebook', 'instagram', 'youtube', 'linkedin', 'x'];

export async function GET(
  _request: Request,
  context: { params: Promise<{ platform: string }> }
) {
  const { user } = await requireUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Sign in required.' }, { status: 401 });
  }

  const { platform } = await context.params;
  if (!PLATFORMS.includes(platform as SocialPlatform)) {
    return NextResponse.json({ success: false, message: 'Unknown platform.' }, { status: 400 });
  }

  try {
    const started = startOauth(platform as SocialPlatform);
    const response = NextResponse.redirect(started.url);
    return setOauthCookies(response, platform as SocialPlatform, started.state, started.verifier);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Could not start OAuth.' },
      { status: 400 }
    );
  }
}
