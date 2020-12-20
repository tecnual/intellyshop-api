import { Model } from 'mongoose';
import { AddItemDto } from './dto/add-item.dto';
import { Item, ItemDocument } from './item.schema';
export declare class ItemService {
    private readonly itemModel;
    constructor(itemModel: Model<ItemDocument>);
    add(addItemDto: AddItemDto): Promise<Item>;
    findAllByName(filter: string): Promise<Item[]>;
    findOneByBarcode(barcode: string): Promise<Item>;
    patchItem(itemId: string, item: Item): Promise<Item>;
}
