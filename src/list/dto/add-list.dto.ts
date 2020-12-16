import { User } from "src/core/user/user.schema";
import { Item } from "src/item/item.schema";

export class AddListDto {
  _id?: string;
  name: string;
  description?: string;
  owner?: ListOwnerDto;
  listItems?: ListItemDto[];
  cartItems?: ListItemDto[];
};

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
