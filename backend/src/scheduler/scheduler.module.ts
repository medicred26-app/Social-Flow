import { Module } from '@nestjs/common';
import { PublishModule } from '../publish/publish.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [PublishModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
