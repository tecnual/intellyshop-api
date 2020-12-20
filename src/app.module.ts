import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { MongoProviderModule } from './providers/database/mongo/provider.module';
import { ListModule } from './list/list.module';
import { ItemModule } from './item/item.module';
import { StoreModule } from './store/store.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    CoreModule,
    ListModule,
    MongoProviderModule,
    ItemModule,
    StoreModule,
    PurchaseModule,
    ConfigModule.forRoot({
        cache: true,
        isGlobal: true,
        load: [configuration]
      }
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/v0/images',

    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
