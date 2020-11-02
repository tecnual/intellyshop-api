import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { MongoProviderModule } from './providers/database/mongo/provider.module';
import { ListModule } from './list/list.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [CoreModule, ListModule, MongoProviderModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
