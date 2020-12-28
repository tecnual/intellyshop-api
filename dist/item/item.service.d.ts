import { Model } from 'mongoose';
import { Item, ItemDocument } from './item.schema';
export declare class ItemService {
    private readonly itemModel;
    constructor(itemModel: Model<ItemDocument>);
    setItem(item: ItemDocument): Promise<Item>;
    findOneById(itemId: string): Promise<Item>;
    findAllByName(filter: string): Promise<Item[]>;
    findOneByBarcode(barcode: string): Promise<Item>;
    patchItem(itemId: string, item: Item): Promise<Item>;
}
