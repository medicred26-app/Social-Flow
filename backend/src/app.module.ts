import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { CryptoModule } from './crypto/crypto.module';
import { PlatformModule } from './platform/platform.module';
import { OAuthModule } from './oauth/oauth.module';
import { AccountsModule } from './accounts/accounts.module';
import { PostsModule } from './posts/posts.module';
import { PublishModule } from './publish/publish.module';
import { JobsModule } from './jobs/jobs.module';
import { SettingsModule } from './settings/settings.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    SupabaseModule,
    CryptoModule,
    PlatformModule,
    AuthModule,
    OAuthModule,
    AccountsModule,
    PostsModule,
    PublishModule,
    JobsModule,
    SettingsModule,
    SchedulerModule,
  ],
})
export class AppModule {}
