import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Price } from './price.schema';

export type ItemDocument = HydratedDocument<Item>;

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class Item {
  @Prop()
  name: string;

  @Prop()
  altNames: string[];

  @Prop()
  barcode?: string;

  @Prop({ type: Object })
  openFoodFactsProduct;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  updatedBy;

  @Prop({ default: 0 })
  price: number;

  @Prop()
  prices: Price[];

  @Prop()
  lastPriceUpdateDate: Date;

  constructor(
    name,
    altNames: string[],
    barcode,
    openFoodFactsProduct,
    description,
    isPublic,
    createdBy,
    updatedBy,
    price,
    prices,
    lastPriceUpdateDate
  ) {
    this.name = name;
    this.altNames = altNames;
    this.barcode = barcode;
    this.openFoodFactsProduct = openFoodFactsProduct;
    this.description = description;
    this.isPublic = isPublic;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.price = price;
    this.prices = prices;
    this.lastPriceUpdateDate = lastPriceUpdateDate;
  }
}

export const ItemSchema = SchemaFactory.createForClass(Item);

export const ItemSchemaProvider = {
  name: Item.name,
  useFactory: () => {
    ItemSchema.pre('find', preQuery);
    ItemSchema.pre('updateOne', preQuery);

    return ItemSchema;
  }
};
const preQuery = function () {
  const query = this.getQuery();
  const ownerId = query['owner._id'];
  delete query['owner._id'];
  query['$or'] = [{ 'owner._id': ownerId }, { 'sharedUsers._id': ownerId }];
  this.setQuery(query);
};
