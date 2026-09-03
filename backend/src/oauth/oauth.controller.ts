import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard, CurrentUser } from '../auth/auth.module';
import { PlatformEnvService } from '../platform/platform-env.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthUser, SocialPlatform } from '../types';
import { OAuthService } from './oauth.service';

const PLATFORMS: SocialPlatform[] = ['facebook', 'instagram', 'youtube', 'linkedin', 'x'];

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oauth: OAuthService,
    private readonly platformEnv: PlatformEnvService,
    private readonly supabaseService: SupabaseService
  ) {}

  @Post(':platform/start')
  @UseGuards(AuthGuard)
  start(
    @Param('platform') platform: string,
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response
  ) {
    if (!PLATFORMS.includes(platform as SocialPlatform)) {
      return { success: false, message: 'Unknown platform.' };
    }

    try {
      const started = this.oauth.startOauth(platform as SocialPlatform);
      this.oauth.setOauthCookies(res, platform as SocialPlatform, started.state, user.id, started.verifier);
      return { success: true, url: started.url };
    } catch (err: any) {
      return { success: false, message: err.message || 'Could not start OAuth.' };
    }
  }

  @Get(':platform/callback')
  async callback(@Param('platform') platform: string, @Req() req: Request, @Res() res: Response) {
    const frontend = this.platformEnv.getFrontendUrl();
    const fail = (message: string) => {
      const url = new URL('/accounts', frontend);
      url.searchParams.set('error', message);
      this.oauth.clearOauthCookies(res);
      return res.redirect(url.toString());
    };

    const code = req.query.code as string | undefined;
    const state = req.query.state as string | undefined;
    const error =
      (req.query.error_description as string) || (req.query.error as string) || undefined;

    if (error) return fail(error);
    if (!code || !state) return fail('OAuth callback missing code or state.');

    const cookies = this.oauth.readOauthCookies(req.cookies || {});
    if (!cookies.state || cookies.state !== state || cookies.platform !== platform) {
      return fail('OAuth state mismatch. Try connecting again.');
    }
    if (!cookies.userId) {
      return fail('Your session expired during OAuth. Sign in and try again.');
    }

    try {
      const accounts = await this.oauth.exchangeAndFetchAccounts(
        platform as SocialPlatform,
        code,
        cookies.verifier
      );

      const admin = this.supabaseService.getAdminClient();
      const rows = this.oauth.toAccountRows(cookies.userId, accounts);

      const { error: upsertError } = await admin.from('connected_accounts').upsert(rows, {
        onConflict: 'user_id,platform,external_id',
      });
      if (upsertError) throw new Error(upsertError.message);

      const url = new URL('/accounts', frontend);
      url.searchParams.set('connected', platform);
      url.searchParams.set('count', String(rows.length));
      this.oauth.clearOauthCookies(res);
      return res.redirect(url.toString());
    } catch (err: any) {
      return fail(err.message || 'OAuth connect failed.');
    }
  }
}
