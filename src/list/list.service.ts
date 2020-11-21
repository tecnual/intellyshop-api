import { Injectable } from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { from, Observable } from 'rxjs';
import { AddListDto } from './dto/add-list.dto';
import { List, ListDocument, ListItem, ListItemDocument } from './list.schema';

import * as mongoose from 'mongoose';

@Injectable()
export class ListService {
  constructor(@InjectModel(List.name) private readonly listModel: Model<ListDocument>) {}

  async add(addListDto: AddListDto, user: any): Promise<List> {
    addListDto.owner = user;
    const addedList = new this.listModel(addListDto);

    return addedList.save();
  }

  async getUserLists(user): Promise<List[]> {
    return this.listModel.find({"owner._id": user._id}).exec();
  }

  public addItemToList(listId: string, listItem: ListItemDocument): Observable<any> {
    listItem._id = new Types.ObjectId();
    return from(this.listModel.updateOne(
      { _id: listId },
      { $push: { listItems: {$each: [listItem], $position: 0}} }
    ));
  }

  public addItemToListCart(listId: string, cartItem: ListItemDocument): Observable<any> {
    cartItem._id = new Types.ObjectId();
    return from(this.listModel.updateOne(
      { _id: listId },
      { $push: { cartItems: {$each: [cartItem], $position: 0}} }
    ));
  }

  public async removeItemFromList(listId: string, listItemId: string) {
    return this.listModel.updateOne({_id: listId}, { $pull: {listItems: { _id: new Types.ObjectId(listItemId)} }});
  }

  public removeItemFromListCart(listId: string, cartItemId: any) {
    return this.listModel.updateOne({_id: listId}, { $pull: {cartItems: { _id: new Types.ObjectId(cartItemId)}}});
  }

  public async updateItemFromList(listId: string, listItemId: string, listItem: any, type: string) {// TODO:

    const setUpdate: any = {}
    listItem.name? setUpdate[type + 'Items.$.name'] = listItem.name: null;
    listItem.itemId? setUpdate[type + 'Items.$.itemId'] = listItem.itemId: null;
    listItem.quantity? setUpdate[type + 'Items.$.quantity'] = Number(listItem.quantity): null;
    listItem.price? setUpdate[type + 'Items.$.price'] = Number(listItem.price): null;

    console.log('setUpdate', setUpdate)

    const query = {_id: listId}
    query[`${type}Items._id`] =  new Types.ObjectId(listItemId);
    return this.listModel.updateOne(query, { $set: setUpdate});
  }
}
