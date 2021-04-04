import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppClusterService } from './app-cluster.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');
  const versionPrefix = configService.get<string>('versionPrefix');
  const corsOrigin = configService.get<string>('corsOrigin');

  app.enableCors({ origin: corsOrigin});

  app.setGlobalPrefix(versionPrefix);
  await app.listen(port);
}
AppClusterService.clusterize(bootstrap);
