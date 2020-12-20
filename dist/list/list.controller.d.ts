/// <reference types="mongoose" />
import { Observable } from 'rxjs';
import { AddListDto } from './dto/add-list.dto';
import { List, ListUser } from './list.schema';
import { ListService } from './list.service';
import { Request } from 'express';
export declare class ListController {
    private readonly listService;
    constructor(listService: ListService);
    upsertList(req: Request, body: AddListDto): Promise<any>;
    getUserLists(req: Request): Promise<List[]>;
    addItemToList(listId: string, req: any): Observable<any>;
    addItemToListCart(listId: string, req: any): Observable<any>;
    removeItemFromList(listId: string, listItemId: string): Promise<any>;
    removeListItems(listId: string): Promise<any>;
    removeCartItems(listId: string): Promise<any>;
    removeItemFromCartList(listId: string, cartItemId: string): import("mongoose").Query<any, import("./list.schema").ListDocument>;
    updateListItem(listId: string, listItemId: string, body: any): Promise<any>;
    updateCartItem(listId: string, listItemId: string, body: any): Promise<any>;
    deleteList(listId: string): Promise<any>;
    addSharedUser(listId: string, user: any): Observable<ListUser>;
}
