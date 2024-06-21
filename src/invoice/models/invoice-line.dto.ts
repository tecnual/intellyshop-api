import { UnitType } from './invoice.schema';

export interface InvoiceLineDTO {
  _id: string;
  barcode?: string;
  quantity: number;
  description: string;
  price: number;
  unitType: UnitType;
  discount?: string;
  item_id?;
}
