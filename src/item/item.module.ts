import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemController } from './item.controller';
import { Item, ItemSchema } from './item.schema';
import { ItemService } from './item.service';
import { OpenFFService } from 'src/shared/openFF/openFF.Service';
import { HttpModule } from '@nestjs/axios';
import { InvoiceService } from 'src/invoice/invoice.service';
import { Invoice, InvoiceSchema } from 'src/invoice/models/invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Invoice.name, schema: InvoiceSchema }
    ]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5
      })
    })
  ],
  controllers: [ItemController],
  providers: [ItemService, OpenFFService, InvoiceService, Logger]
})
export class ItemModule {}
