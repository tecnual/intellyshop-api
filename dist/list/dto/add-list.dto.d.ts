import { User } from "src/core/user/user.schema";
import { Item } from "src/item/item.schema";
export declare class AddListDto {
    _id?: string;
    name: string;
    description?: string;
    owner?: ListOwnerDto;
    listItems?: ListItemDto[];
    cartItems?: ListItemDto[];
}
export declare class ListItemDto {
    quantity: number;
    price: number;
    currency: string;
    name: string;
    itemId: Item;
}
export declare class ListOwnerDto {
    name: string;
    email: string;
    _id: User;
}
