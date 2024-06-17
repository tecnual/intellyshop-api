import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ListUser } from 'src/list/list.schema';
import { Price } from './price.schema';

export type ItemDocument = HydratedDocument<Item>;

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class Item {
  @Prop()
  name: string;

  @Prop()
  barcode?: string;

  @Prop({ type: Object })
  openFoodFactsProduct;

  @Prop()
  description?: string;

  @Prop({ default: true })
  public: boolean;

  @Prop()
  createdBy: ListUser;

  @Prop()
  updatedBy: ListUser[];

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  prices: Price[];

  @Prop({ default: 0 })
  lastPriceUpdateDate: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
