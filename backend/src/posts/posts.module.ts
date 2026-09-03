import { Module } from '@nestjs/common';
import { PublishModule } from '../publish/publish.module';
import { PostsController } from './posts.controller';

@Module({
  imports: [PublishModule],
  controllers: [PostsController],
})
export class PostsModule {}
