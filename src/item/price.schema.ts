import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PriceDocument = Price & Document;

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class Price {
  @Prop({ default: 0 })
  price: number;

  @Prop({ type: Object })
  openFoodFactsPrice;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy: Types.ObjectId;

  @Prop()
  createdOn: Date;

  @Prop()
  source: Source;

  @Prop()
  currency: string;

  @Prop()
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Invoice', required: false })
  invoice_id?;

  constructor(price: number, user: Types.ObjectId, source, currency, date: Date, openFoodFactsPrice?: any, invoiceId?) {
    this.price = Number(price);
    this.createdBy = user;
    this.source = source;
    this.currency = currency;
    console.log('date: ', date);
    this.date = new Date(date);
    console.log('this.date: ', this.date);
    if (source === Source.OPEN_FOOD_FACTS && openFoodFactsPrice) {
      this.openFoodFactsPrice = openFoodFactsPrice;
      this.date = new Date(openFoodFactsPrice.date);
    }
    if (invoiceId) this.invoice_id = invoiceId;
    this.createdOn = new Date();
  }
}

export enum Source {
  SYSTEM = 'System',
  OPEN_FOOD_FACTS = 'OpenFoodFacts',
  USER = 'User',
  INVOICE = 'Invoice'
}

export const PriceSchema = SchemaFactory.createForClass(Price);
