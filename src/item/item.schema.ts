import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ListUser } from 'src/list/list.schema';

export type ItemDocument = Item & Document;

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class Item {
  @Prop()
  name: string;

  @Prop()
  barcode?: string;

  @Prop({ type: Object})
  openFoodFactsProduct;

  @Prop()
  description?: string;

  @Prop({default: true})
  public:  boolean;

  @Prop()
  createdBy: ListUser;

  @Prop()
  updatedBy: ListUser[];

  @Prop({default: 0})
  price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
