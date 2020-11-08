import { User } from "src/core/user/user.schema";
import { Item } from "src/item/item.schema";

export class AddListDto {
  readonly name: string;
  readonly description?: string;
  owner?: ListOwnerDto;
  readonly items?: ListItemDto[];
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
