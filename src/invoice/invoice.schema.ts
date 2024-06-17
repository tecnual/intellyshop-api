import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as Sch } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class Invoice {
  @Prop()
  lines: InvoiceLine[];

  @Prop()
  currency: string;

  @Prop()
  total: number;

  @Prop()
  date: Date;

  @Prop({ type: Sch.Types.ObjectId, ref: 'List' })
  list_id;

  @Prop({ type: Sch.Types.ObjectId, ref: 'User' })
  user_id;

  constructor(lines, currency, total, date, list_id, user_id) {
    this.lines = lines;
    this.currency = currency;
    this.total = total;
    this.date = date;
    this.list_id = list_id;
    this.user_id = user_id;
  }
}

export class InvoiceLine {
  @Prop()
  quantity: number;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  unitType: UnitType;

  @Prop({ required: false })
  discount?: string;

  @Prop({ type: Sch.Types.ObjectId, ref: 'Item', required: false })
  itemId?;
}

export enum UnitType {
  UNIT = 'u',
  KG = 'Kg',
  G = 'g',
  L = 'L',
  PACK = 'Pack'
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

export const InvoiceSchemaProvider = {
  name: Invoice.name,
  useFactory: () => {
    //InvoiceSchema.pre('find', preQuery);
    InvoiceSchema.pre('updateOne', preQuery);

    return InvoiceSchema;
  }
};

const preQuery = function () {
  const query = this.getQuery();
  const user_id = query['user_id'];
  delete query['user_id'];
  query['$or'] = [{ user_id: user_id }];
  this.setQuery(query);
};
