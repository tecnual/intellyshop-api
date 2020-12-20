import { Document, Schema as Sch, Types } from 'mongoose';
export declare type ListUserDocument = ListUser & Document;
export declare type ListItemDocument = ListItem & Document;
export declare type ListDocument = List & Document;
export declare class ListUser {
    name: string;
    email: string;
    _id: any;
}
export declare class List {
    name: string;
    description: string;
    owner: any;
    store?: any;
    listItems: ListItem[];
    cartItems: ListItem[];
    sharedUsers?: ListUser[];
}
export declare class ListItem {
    _id: Types.ObjectId;
    quantity?: number;
    price?: number;
    currency?: string;
    name?: string;
    itemId: any;
}
export declare const ListSchema: Sch<any>;
