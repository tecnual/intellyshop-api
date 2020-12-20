import { Document } from 'mongoose';
import { ListUser } from 'src/list/list.schema';
export declare type ItemDocument = Item & Document;
export declare class Item {
    name: string;
    barcode?: string;
    openFoodFactsProduct: any;
    description?: string;
    public: boolean;
    createdBy: ListUser;
    updatedBy: ListUser[];
    price: number;
}
export declare const ItemSchema: import("mongoose").Schema<any>;
