import { Controller, Headers, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PublishService } from '../publish/publish.service';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly publish: PublishService,
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService
  ) {}

  @Post('publish-due')
  async publishDue(@Headers('authorization') authorization?: string) {
    const expected = this.config.get<string>('CRON_SECRET');
    if (!expected || authorization !== `Bearer ${expected}`) {
      return { success: false, message: 'Unauthorized.' };
    }

    try {
      const result = await this.publish.processDuePosts(this.supabase.getAdminClient());
      return { success: true, ...result };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
}
