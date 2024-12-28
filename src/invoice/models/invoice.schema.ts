import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as Sch, Types } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

export enum UnitType {
  UNIT = 'u',
  KG = 'Kg',
  G = 'g',
  L = 'L',
  PACK = 'Pack'
}

export enum InvoiceType {
  GENERIC = 'Generic Invoice',
  MERCADONA = 'Mercadona',
  ALIMERKA = 'Alimerka',
  LIDL = 'Lidl'
}

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class Invoice {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  number: string;

  @Prop()
  lines: InvoiceLine[];

  @Prop()
  currency: string;

  @Prop()
  total: number;

  @Prop()
  date: Date;

  @Prop()
  ffId?: string;

  @Prop({ type: Sch.Types.ObjectId, ref: 'List' })
  list_id;

  @Prop({ type: Sch.Types.ObjectId, ref: 'User' })
  user_id;

  @Prop()
  invoiceType: InvoiceType;

  constructor(number, lines, currency, total, date, list_id, user_id, invoiceId?, invoiceType?: InvoiceType) {
    this._id = invoiceId ? invoiceId : new Types.ObjectId();
    this.number = number;
    this.lines = lines;
    this.currency = currency;
    this.total = total;
    this.date = date;
    this.list_id = list_id;
    this.user_id = user_id;
    this.invoiceType = invoiceType ? invoiceType : InvoiceType.GENERIC;
  }
}

export class InvoiceLine {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: false })
  barcode?: string;

  @Prop()
  quantity: number;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  @ApiProperty({ enum: UnitType, enumName: 'UnitType' })
  unitType: UnitType;

  @Prop({ required: false })
  discount?: string;

  @Prop({ type: Types.ObjectId, ref: 'Item', required: false })
  item_id?;
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
