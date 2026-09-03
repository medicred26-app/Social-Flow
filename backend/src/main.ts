import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const frontendUrl = config.get<string>('FRONTEND_URL') || 'http://localhost:4000';

  app.use(cookieParser());
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
  app.setGlobalPrefix('api');

  const port = Number(config.get<string>('PORT') || 3001);
  await app.listen(port);
  console.log(`SocialFlow API listening on http://localhost:${port}/api`);
}

bootstrap();
