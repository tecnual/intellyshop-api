import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ListUser } from 'src/list/list.schema';

export type PriceDocument = Price & Document;

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class Price {
  @Prop({ default: 0 })
  price: number;

  @Prop({ type: Object })
  openFoodFactsPrice;

  @Prop()
  createdBy: ListUser;

  @Prop()
  createdOn: Date;

  @Prop()
  source: Source;

  @Prop()
  currency: string;

  @Prop()
  date: Date;

  constructor(
    price: number,
    user: ListUser,
    source,
    currency,
    openFoodFactsPrice?: any
  ) {
    this.price = price;
    this.createdBy = user;
    this.source = source;
    this.currency = currency;
    this.createdOn = new Date();
    if (source === Source.OPEN_FOOD_FACTS && openFoodFactsPrice) {
      this.openFoodFactsPrice = openFoodFactsPrice;
      this.date = openFoodFactsPrice.date;
    }
  }
}

export enum Source {
  SYSTEM = 'System',
  OPEN_FOOD_FACTS = 'OpenFoodFacts',
  USER = 'User'
}

export const PriceSchema = SchemaFactory.createForClass(Price);
