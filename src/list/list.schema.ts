import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Schema as sch, Types } from 'mongoose';

export type ListOwnerDocument = ListOwner & Document;
export type ListItemDocument = ListItem & Document;
export type ListDocument = List & Document;

@Schema()
export class ListItem {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  quantity?: number;

  @Prop()
  price?: number;

  @Prop()
  currency?: string;

  @Prop()
  name?: string;

  @Prop()
  itemId: {
    type: sch.Types.ObjectId,
    ref: 'Item'
  };
}

@Schema()
export class List {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  owner: {type: ListOwner};

  @Prop()
  store?: {
    type: sch.Types.ObjectId,
    ref: 'Store'
  };

  @Prop()
  listItems: ListItem[];

  @Prop()
  cartItems: ListItem[];

}


@Schema()
export class ListOwner {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  _id: {
    type: sch.Types.ObjectId,
    ref: 'User'
  };
}

export const ListSchema = SchemaFactory.createForClass(List);
