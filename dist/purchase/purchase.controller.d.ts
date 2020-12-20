import { ListItemDto } from 'src/list/dto/add-list.dto';
import { PurchaseService } from './purchase.service';
import { Request } from 'express';
export declare class PurchaseController {
    private readonly purchaseService;
    constructor(purchaseService: PurchaseService);
    addPurchase(req: Request, body: ListItemDto[]): Promise<any>;
}
