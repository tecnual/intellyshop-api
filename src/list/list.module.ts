import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ListSchemaProvider } from './list.schema';
import { SavedListSchemaProvider } from './saved-list/saved-list.schema';
import { InvoiceService } from 'src/invoice/invoice.service';
import { InvoiceSchemaProvider } from 'src/invoice/invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      ListSchemaProvider,
      SavedListSchemaProvider,
      InvoiceSchemaProvider
    ])
  ],
  controllers: [ListController],
  providers: [ListService, InvoiceService]
})
export class ListModule {}
