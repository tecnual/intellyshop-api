import { Document, Schema as sch } from 'mongoose';
import { ListItem, ListUser } from 'src/list/list.schema';
export declare type PurchaseDocument = Purchase & Document;
export declare class Purchase {
    user?: ListUser;
    list?: any;
    totalPrice: number;
    totalQuantity: number;
    listItems?: ListItem[];
}
export declare const PurchaseSchema: sch<any>;
