import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { AppClusterService } from './app-cluster.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');
  const versioPrefix = configService.get<string>('versionPrefix');
  const corsOrigin = configService.get<string>('corsOrigin');

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.enableCors({ origin: corsOrigin});

  app.setGlobalPrefix(versioPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true, skipMissingProperties: true }));
  await app.listen(port);
}

AppClusterService.clusterize(bootstrap);
