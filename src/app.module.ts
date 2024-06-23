import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { ListModule } from './list/list.module';
import { SavedListModule } from './list/saved-list/saved-list.module';
import { MongoProviderModule } from './providers/database/mongo/provider.module';
import { ItemModule } from './item/item.module';
import { StoreModule } from './store/store.module';
import { FinanceModule } from './routes/finance/finance.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import configuration from './config/configuration';
import { InvoiceModule } from './invoice/invoice.module';
import { WinstonModule, utilities } from 'nest-winston';
import { transports, format } from 'winston';

@Module({
  imports: [
    CoreModule,
    ListModule,
    SavedListModule,
    MongoProviderModule,
    ItemModule,
    InvoiceModule,
    StoreModule,
    InvoiceModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/v0/images'
    }),
    FinanceModule,
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        exitOnError: true,
        transports: [
          new transports.Console({
            level: configService.get('logLevel'),
            handleExceptions: true,
            format: format.combine(
              format.timestamp(),
              format.ms(),
              utilities.format.nestLike('IntellyShop', {
                colors: true,
                prettyPrint: true,
                processId: true
              })
            )
          })
        ]
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
