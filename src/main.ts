import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.WS_VERSION || 'v0');
  await app.listen(process.env.WS_PORT || 3000);
}
bootstrap();
