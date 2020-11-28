import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Schema as sch, Types } from 'mongoose';
import { ListItem, Owner } from 'src/list/list.schema';

export type PurchaseDocument = Purchase & Document;

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class Purchase {
  @Prop()
  user?: Owner;

  @Prop()
  list?: {
    type: sch.Types.ObjectId,
    ref: 'List'
  };

  @Prop()
  totalPrice: number;

  @Prop()

  totalQuantity: number;

  @Prop()
  listItems?: ListItem[];

}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
