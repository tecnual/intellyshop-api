import { User } from 'src/core/user/user.schema';
import { Item } from 'src/item/item.schema';
import { ListUser } from '../list.schema';
import { Types } from 'mongoose';

export enum FileType {
  IMAGE = 'Image',
  TICKET = 'Ticket',
  CARD = 'Card',
  OTHER = 'Other'
}
export class AddListDto {
  _id?: string;
  name: string;
  description?: string;
  owner?: ListOwnerDto;
  listItems?: ListItemDto[];
  cartItems?: ListItemDto[];
  sharedUsers?: ListUser[];
  totals?: any;
  store?: any;
  tags?: string[];
  cards?: Card[];
  files?: ListFile[];
}

export class Card {
  file: string;
  number: string;
}

export interface ListFile {
  file: string;
  type: FileType;
  mimeType: string;
  date: Date;
  invoice_id: Types.ObjectId;
  size: number;
  name: string;
}

export interface AddInvoiceRequestDto {
  file: ListFile;
  firefly: any;
}
export class ListItemDto {
  quantity: number;
  price: number;
  currency: string;
  name: string;
  itemId: Item;
}

export class ListOwnerDto {
  name: string;
  email: string;
  _id: User;
}
