import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  morgan.token('user-name', function (req) {
    let username = 'no-user';
    if (req.user) username = req.user.name;
    return username;
  });
  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :user-name',
      {
        stream: {
          write: (message) => {
            console.log(message);
          }
        }
      }
    )
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.setGlobalPrefix('v0');
  await app.listen(3000);
}
bootstrap();
