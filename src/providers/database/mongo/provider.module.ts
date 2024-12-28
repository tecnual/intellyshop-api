import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        let dbUrl;
        const password = configService.get<string>('database.password');

        if (configService.get<string>('database.schema') === 'mongodb+srv') {
          dbUrl =
            configService.get<string>('database.schema') +
            '://' +
            configService.get<string>('database.user') +
            ':' +
            configService.get<string>('database.password') +
            '@' +
            configService.get<string>('database.host') +
            '/' +
            configService.get<string>('database.dbName') +
            '?' +
            configService.get<string>('database.options');
        } else {
          dbUrl =
            configService.get<string>('database.schema') +
            '://' +
            configService.get<string>('database.user') +
            ':' +
            configService.get<string>('database.password') +
            '@' +
            configService.get<string>('database.host') +
            ':' +
            configService.get<string>('database.port') +
            '/' +
            '?' +
            configService.get<string>('database.options');
        }
        Logger.verbose('Mongo conexion: ' + dbUrl.replace(password, '*****'));
        return {
          uri: dbUrl,
          dbName: configService.get<string>('database.dbName')
        };
      },
      inject: [ConfigService]
    })
  ]
})
export class MongoProviderModule {}
