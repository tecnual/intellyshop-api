import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }])
  ],
  providers: [InvoiceService]
})
export class InvoiceModule {}
