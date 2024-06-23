import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ListSchemaProvider } from './list.schema';
import { SavedListSchemaProvider } from './saved-list/saved-list.schema';
import { InvoiceService } from 'src/invoice/invoice.service';
import { ItemService } from 'src/item/item.service';
import { OpenFFService } from 'src/shared/openFF/openFF.Service';
import { ItemSchemaProvider } from 'src/item/item.schema';
import { HttpModule } from '@nestjs/axios';
import { InvoiceSchemaProvider } from 'src/invoice/models/invoice.schema';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([ListSchemaProvider, SavedListSchemaProvider, InvoiceSchemaProvider, ItemSchemaProvider]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5
      })
    })
  ],
  controllers: [ListController],
  providers: [ListService, InvoiceService, ItemService, OpenFFService, Logger]
})
export class ListModule {}
