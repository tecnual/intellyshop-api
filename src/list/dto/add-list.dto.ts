import { Item } from "src/item/item.schema";

export class AddListDto {
  readonly name: string;
  readonly description?: string;
  readonly items?: ListItemDto[];
};

export class ListItemDto {
  quantity: number;
  price: number;
  currency: string;
  name: string;
  itemId: Item;
}
