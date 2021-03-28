import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Schema as sch } from 'mongoose';
import { ListItem, ListUser } from 'src/list/list.schema';

export type PurchaseDocument = Purchase & Document;

@Schema()
export class Ticket {
  @Prop()
  capture?: string;
}
@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class Purchase {
  @Prop()
  user?: ListUser;

  @Prop({ type: sch.Types.ObjectId, ref: 'List' })
  list?;

  @Prop()
  totalPrice: number;

  @Prop()
  totalQuantity: number;

  @Prop()
  listItems?: ListItem[];

  @Prop()
  ticket?: Ticket;

}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
