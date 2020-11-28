import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { MongoProviderModule } from './providers/database/mongo/provider.module';
import { ListModule } from './list/list.module';
import { ItemModule } from './item/item.module';
import { StoreModule } from './store/store.module';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [CoreModule, ListModule, MongoProviderModule, ItemModule, StoreModule, PurchaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
