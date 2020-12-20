import { Model } from 'mongoose';
import { PurchaseDocument } from './purchase.schema';
export declare class PurchaseService {
    private readonly purchaseModel;
    constructor(purchaseModel: Model<PurchaseDocument>);
    add(user: any, data: any): Promise<PurchaseDocument>;
}
