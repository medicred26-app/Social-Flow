import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PublishService } from '../publish/publish.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);
  private enabled = false;

  constructor(
    private readonly config: ConfigService,
    private readonly supabase: SupabaseService,
    private readonly publish: PublishService
  ) {}

  onModuleInit() {
    this.enabled = this.config.get<string>('ENABLE_INLINE_SCHEDULER') === 'true';
    if (!this.enabled) return;

    if (!this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY') || !this.config.get<string>('TOKEN_ENCRYPTION_KEY')) {
      this.logger.warn('Scheduler not started: SUPABASE_SERVICE_ROLE_KEY or TOKEN_ENCRYPTION_KEY missing.');
      this.enabled = false;
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async tick() {
    if (!this.enabled) return;
    try {
      const result = await this.publish.processDuePosts(this.supabase.getAdminClient());
      if (result.count > 0) {
        this.logger.log(`Published ${result.count} due post(s).`);
      }
    } catch (err) {
      this.logger.error('Scheduler tick failed', err);
    }
  }
}
