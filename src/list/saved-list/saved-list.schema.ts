import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Schema as Sch } from 'mongoose';
import { ListItem, ListUser } from '../list.schema';

export type SavedListDocument = SavedList & Document;

@Schema()
export class Totals {
  @Prop()
  cartQuantityTotal: number;
  @Prop()
  cartTotal: number;
  @Prop()
  listQuantityTotal: number;
  @Prop()
  listTotal: number;
  @Prop()
  total: number;
}

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class SavedList {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({type: ListUser})
  owner;

  @Prop({type: Boolean, default: false})
  saved;

  @Prop({ type: Sch.Types.ObjectId, ref: 'Store'})
  store?;

  @Prop()
  listItems: ListItem[];

  @Prop()
  cartItems: ListItem[];

  @Prop()
  sharedUsers?: ListUser[];

  @Prop({type: Totals})
  totals?;

  @Prop()
  images?: string[];
}

export const SavedListSchema = SchemaFactory.createForClass(SavedList);
