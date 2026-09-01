import { NextResponse } from 'next/server';
import { SocialPlatform } from '@/types';
import { getAppUrl } from '@/lib/supabase/env';
import { requireUser } from '@/lib/server/require-user';
import {
  clearOauthCookies,
  exchangeAndFetchAccounts,
  readOauthCookies,
  toAccountRows,
} from '@/lib/server/oauth';

function fail(message: string) {
  const url = new URL('/accounts', getAppUrl());
  url.searchParams.set('error', message);
  const response = NextResponse.redirect(url);
  return clearOauthCookies(response);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ platform: string }> }
) {
  const { platform } = await context.params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error_description') || searchParams.get('error');

  if (error) return fail(error);
  if (!code || !state) return fail('OAuth callback missing code or state.');

  const cookies = readOauthCookies(request);
  if (!cookies.state || cookies.state !== state || cookies.platform !== platform) {
    return fail('OAuth state mismatch. Try connecting again.');
  }

  const { supabase, user } = await requireUser();
  if (!user) return fail('Your session expired during OAuth. Sign in and try again.');

  try {
    const accounts = await exchangeAndFetchAccounts(
      platform as SocialPlatform,
      code,
      cookies.verifier
    );
    const rows = toAccountRows(user.id, accounts);

    const { error: upsertError } = await supabase.from('connected_accounts').upsert(rows, {
      onConflict: 'user_id,platform,external_id',
    });
    if (upsertError) throw new Error(upsertError.message);

    const url = new URL('/accounts', getAppUrl());
    url.searchParams.set('connected', platform);
    url.searchParams.set('count', String(rows.length));
    const response = NextResponse.redirect(url);
    return clearOauthCookies(response);
  } catch (err: any) {
    return fail(err.message || 'OAuth connect failed.');
  }
}
