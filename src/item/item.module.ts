import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemController } from './item.controller';
import { Item, ItemSchema } from './item.schema';
import { ItemService } from './item.service';
import { OpenFFService } from 'src/shared/openFF/openFF.Service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [ItemController],
  providers: [ItemService, OpenFFService],
})
export class ItemModule {}
