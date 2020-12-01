import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Owner } from 'src/list/list.schema';

export type ItemDocument = Item & Document;

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class Item {

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  public:  boolean;

  @Prop()
  createdBy: Owner;

  @Prop()
  updatedBy: Owner[];

  @Prop()
  price: number;

}

export const ItemSchema = SchemaFactory.createForClass(Item);
