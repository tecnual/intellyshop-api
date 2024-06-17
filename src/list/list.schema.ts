import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as Sch, Types } from 'mongoose';
import { Card, ListFile } from './dto/add-list.dto';

export type ListUserDocument = HydratedDocument<ListUser>;
export type ListItemDocument = HydratedDocument<ListItem>;
export type ListDocument = HydratedDocument<List>;

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
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Boolean, default: true })
  income: boolean;

  @Prop({ type: ListUser })
  owner;

  @Prop({ type: Boolean, default: false })
  saved;

  @Prop({ type: Types.ObjectId, ref: 'Store' })
  store?;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Invoice' }] })
  invoices?;

  @Prop()
  listItems: ListItem[];

  @Prop()
  cartItems: ListItem[];

  @Prop()
  sharedUsers?: ListUser[];

  @Prop()
  images?: string[];

  @Prop()
  tags?: string[];

  @Prop()
  cards?: Card[];

  @Prop()
  files?: ListFile[];
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
  barcode?: number;

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

export const ListSchemaProvider = {
  name: List.name,
  useFactory: () => {
    ListSchema.pre('find', preQuery);
    ListSchema.pre('updateOne', preQuery);

    return ListSchema;
  }
};
const preQuery = function () {
  const query = this.getQuery();
  const ownerId = query['owner._id'];
  delete query['owner._id'];
  query['$or'] = [{ 'owner._id': ownerId }, { 'sharedUsers._id': ownerId }];
  this.setQuery(query);
};
