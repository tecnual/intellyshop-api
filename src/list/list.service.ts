import { Injectable } from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import { Model, Query, Types} from 'mongoose';
import { from, Observable } from 'rxjs';
import { AddListDto } from './dto/add-list.dto';
import { List, ListDocument, ListItemDocument, ListUser } from './list.schema';

@Injectable()
export class ListService {
  constructor(@InjectModel(List.name) private readonly listModel: Model<ListDocument>) {}

  async upsert(addListDto: AddListDto, user: any): Promise<any> {
    addListDto.owner = user;
    const addedList = new this.listModel(addListDto);

    return this.listModel.findOneAndUpdate( {_id: addedList._id} , addedList , {new: true, upsert: true}).exec();
  }

  async getUserLists(user): Promise<List[]> {
    return this.listModel.find({ $or: [{"owner._id": user._id}, {'sharedUsers._id': user._id}]}).exec();
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

    const query = {_id: listId}
    query[`${type}Items._id`] =  new Types.ObjectId(listItemId);
    return this.listModel.updateOne(query, { $set: setUpdate});
  }

  public async removeListItems(listId: string) {
    return this.listModel.updateOne({_id: listId}, { $set: {listItems: [] }});
  }

  public async removeCartItems(listId: string) {
    return this.listModel.updateOne({_id: listId}, { $set: {cartItems: [] }});
  }

  public async deleteList(listId: string) {
    return this.listModel.deleteOne({_id: listId});
  }

  public addSharedUser(listId: string, user: ListUser): Observable<any> {
    return from(this.listModel.updateOne(
      { _id: listId },
      { $push: { sharedUsers: {$each: [user], $position: 0}} }
    ));
  }

  /**
   * Add an image to list
   * @param listId
   * @param image
   * @returns DB response
   */
  public addImageToList(listId:string, image: string): Query<ListDocument, ListDocument> {
    return this.listModel.findByIdAndUpdate(
      { _id: listId },
      { $push: { images: image } },
      { 'new': true }
    );
  }
}
