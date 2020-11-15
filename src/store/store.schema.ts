import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sch } from 'mongoose';

export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @Prop()
  name: string;

  @Prop()
  Address: string;

  @Prop()
  type: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
