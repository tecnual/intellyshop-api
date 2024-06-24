import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './models/invoice.schema';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { ItemService } from 'src/item/item.service';
import { OpenFFService } from 'src/shared/openFF/openFF.Service';
import { Item, ItemSchema } from 'src/item/item.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Item.name, schema: ItemSchema }
    ]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5
      })
    })
  ],
  providers: [InvoiceService, ItemService, OpenFFService, Logger],
  controllers: [InvoiceController]
})
export class InvoiceModule {}
