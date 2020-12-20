import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { AddListDto } from './dto/add-list.dto';
import { List, ListDocument, ListItemDocument, ListUser } from './list.schema';
export declare class ListService {
    private readonly listModel;
    constructor(listModel: Model<ListDocument>);
    upsert(addListDto: AddListDto, user: any): Promise<any>;
    getUserLists(user: any): Promise<List[]>;
    addItemToList(listId: string, listItem: ListItemDocument): Observable<any>;
    addItemToListCart(listId: string, cartItem: ListItemDocument): Observable<any>;
    removeItemFromList(listId: string, listItemId: string): Promise<any>;
    removeItemFromListCart(listId: string, cartItemId: any): import("mongoose").Query<any, ListDocument>;
    updateItemFromList(listId: string, listItemId: string, listItem: any, type: string): Promise<any>;
    removeListItems(listId: string): Promise<any>;
    removeCartItems(listId: string): Promise<any>;
    deleteList(listId: string): Promise<any>;
    addSharedUser(listId: string, user: ListUser): Observable<any>;
}
