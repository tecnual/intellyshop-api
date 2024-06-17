import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoreDocument = HydratedDocument<Store>;

@Schema()
export class Store {
  @Prop()
  name: string;

  @Prop()
  Address: string;

  @Prop()
  type: StoreType;
}

export enum StoreType {
  SUPERMARKET = 'SuperMarket',
  ONLINE = 'Online'
}

export const StoreSchema = SchemaFactory.createForClass(Store);
