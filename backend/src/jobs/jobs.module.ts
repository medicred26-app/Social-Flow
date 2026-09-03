import { Module } from '@nestjs/common';
import { PublishModule } from '../publish/publish.module';
import { JobsController } from './jobs.controller';

@Module({
  imports: [PublishModule],
  controllers: [JobsController],
})
export class JobsModule {}
