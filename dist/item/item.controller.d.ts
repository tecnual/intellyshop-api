import { Request } from 'express';
import { Item } from './item.schema';
import { ItemService } from './item.service';
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    addItem(req: Request): Promise<Item>;
    getItems(name: string, barcode: string): Promise<Item[] | Item>;
    patchItem(req: Request, itemId: string): Promise<Item>;
}
