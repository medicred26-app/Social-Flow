import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../auth/auth.module';
import { PlatformEnvService } from '../platform/platform-env.service';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly platformEnv: PlatformEnvService,
    private readonly config: ConfigService
  ) {}

  @Get('status')
  @UseGuards(AuthGuard)
  status() {
    const encryptionKey = this.config.get<string>('TOKEN_ENCRYPTION_KEY') || '';
    return {
      success: true,
      supabaseUrl: Boolean(this.config.get<string>('SUPABASE_URL')),
      serviceRole: Boolean(this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')),
      encryptionKey: Boolean(encryptionKey && encryptionKey.length === 64),
      cronSecret: Boolean(this.config.get<string>('CRON_SECRET')),
      inlineScheduler: this.config.get<string>('ENABLE_INLINE_SCHEDULER') === 'true',
      platforms: this.platformEnv.configuredPlatforms(),
    };
  }
}
