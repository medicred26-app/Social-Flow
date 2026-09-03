import { Global, Module } from '@nestjs/common';
import { PlatformEnvService } from './platform-env.service';

@Global()
@Module({
  providers: [PlatformEnvService],
  exports: [PlatformEnvService],
})
export class PlatformModule {}
