import { Document, Schema as sch } from 'mongoose';
export declare type StoreDocument = Store & Document;
export declare class Store {
    name: string;
    Address: string;
    type: string;
}
export declare const StoreSchema: sch<any>;
