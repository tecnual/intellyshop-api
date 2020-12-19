import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

// mongodb+srv://tecnual:<password>@cluster0.5qzfu.mongodb.net/<dbname>?retryWrites=true&w=majority
@Module({
  imports: [
  //  MongooseModule.forRoot('mongodb://localhost/shoptonic', {useCreateIndex: true, autoIndex: true, useFindAndModify: false})
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      let dbUrl;

      if (configService.get<string>('database.schema') === 'mongodb+srv') {
      dbUrl = configService.get<string>('database.schema') +
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
      dbUrl = configService.get<string>('database.schema') +
      '://' +
      configService.get<string>('database.user') +
      ':' +
      configService.get<string>('database.password') +
      '@' +
      configService.get<string>('database.host') +
      ':' +
      configService.get<string>('database.port') +
      '/' +
      configService.get<string>('database.dbName') +
      '?' +
      configService.get<string>('database.options');

      }
      console.log('dbUrl', dbUrl, process.env.WS_DB_HOST);

      return ({
      useCreateIndex: true,
      autoIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      uri: dbUrl
    })
    },
    inject: [ConfigService],
  })
  ],
})
export class MongoProviderModule {}
