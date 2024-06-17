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
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import configuration from './config/configuration';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    CoreModule,
    ListModule,
    SavedListModule,
    MongoProviderModule,
    ItemModule,
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
    FinanceModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
