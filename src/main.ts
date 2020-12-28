import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');
  const versioPrefix = configService.get<string>('versionPrefix');
  const corsOrigin = configService.get<string>('corsOrigin');
  app.enableCors({ origin: corsOrigin});

  app.setGlobalPrefix(versioPrefix);
  await app.listen(port);
}
bootstrap();
