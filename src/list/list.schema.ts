import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Schema as Sch, Types } from 'mongoose';

export type ListUserDocument = ListUser & Document;
export type ListItemDocument = ListItem & Document;
export type ListDocument = List & Document;


@Schema()
export class ListUser {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ type: Sch.Types.ObjectId, ref: 'User' })
  _id;
}

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class List {
  @Prop({unique: true})
  name: string;

  @Prop()
  description: string;

  @Prop({type: ListUser})
  owner;

  @Prop({ type: Sch.Types.ObjectId, ref: 'Store'})
  store?;

  @Prop()
  listItems: ListItem[];

  @Prop()
  cartItems: ListItem[];

  @Prop()
  sharedUsers?: ListUser[];
}

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
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

  @Prop({ type: Sch.Types.ObjectId, ref: 'Item' })
  itemId;
}


export const ListSchema = SchemaFactory.createForClass(List);
