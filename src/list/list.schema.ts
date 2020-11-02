import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sch } from 'mongoose';

export type ListDocument = List & Document;

@Schema()
export class List {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  items: ListItem[]
}

export const ListSchema = SchemaFactory.createForClass(List);

export type ListItemDocument = ListItem & Document;

@Schema()
export class ListItem {
  @Prop()
  quantity: number;

  @Prop()
  price: number;

  @Prop()
  currency: string;

  @Prop()
  name: string;

  @Prop()
  itemId: {
    type: sch.Types.ObjectId,
    ref: 'Item'
  }
}