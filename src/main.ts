import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const logEnv = process.env.WS_LOG_LEVEL || 'log';
  const logLevel: any[] = logEnv.split(',');

  const app = await NestFactory.create(AppModule, {
    logger: logLevel
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.setGlobalPrefix('v0');
  await app.listen(3000);
}
bootstrap();
