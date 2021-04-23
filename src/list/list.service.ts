import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { from, Observable } from 'rxjs';
import { AddListDto } from './dto/add-list.dto';
import { List, ListDocument, ListItemDocument, ListUser } from './list.schema';
import { SavedList, SavedListDocument } from './saved-list/saved-list.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name) private readonly listModel: Model<ListDocument>,
    @InjectModel(SavedList.name) private readonly savedListModel: Model<SavedListDocument>,
  ) { }

  async upsert(addListDto: AddListDto, user: any): Promise<any> {
    addListDto.owner = user;
    const addedList = new this.listModel(addListDto);

    return this.listModel.findOneAndUpdate({ _id: addedList._id }, addedList, { new: true, upsert: true }).exec();
  }

  async getUserLists(user: ListUser): Promise<List[]> {
    return this.listModel.find({ "owner._id": user._id }).exec();
  }

  public addItemToItemsList(listId: string, listItem: ListItemDocument, user: ListUser): Observable<any> {
    listItem._id = new Types.ObjectId();
    return from(this.listModel.updateOne(
      { _id: listId, 'owner._id': user._id},
      { $push: { listItems: { $each: [listItem], $position: 0 } } }
    ));
  }

  public addItemToCartList(listId: string, cartItem: ListItemDocument, user: ListUser): Observable<any> {
    cartItem._id = new Types.ObjectId();
    return from(this.listModel.updateOne(
      { _id: listId, 'owner._id': user._id},
      { $push: { cartItems: { $each: [cartItem], $position: 0 } } }
    ));
  }

  public async removeItemFromList(listId: string, listItemId: string, user: ListUser) {
    return this.listModel.updateOne({ _id: listId, 'owner._id': user._id }, { $pull: { listItems: { _id: new Types.ObjectId(listItemId) } } });
  }

  public removeItemFromListCart(listId: string, cartItemId: any, user: ListUser) {
    return this.listModel.updateOne({ _id: listId, 'owner._id': user._id }, { $pull: { cartItems: { _id: new Types.ObjectId(cartItemId) } } });
  }

  public async updateItemFromList(listId: string, listItemId: string, listItem: any, type: string, user: ListUser) {// TODO:

    const setUpdate: any = {}
    listItem.name ? setUpdate[type + 'Items.$.name'] = listItem.name : null;
    listItem.itemId ? setUpdate[type + 'Items.$.itemId'] = listItem.itemId : null;
    listItem.quantity ? setUpdate[type + 'Items.$.quantity'] = Number(listItem.quantity) : null;
    listItem.price ? setUpdate[type + 'Items.$.price'] = Number(listItem.price) : null;

    const query = { _id: listId, 'owner._id': user._id }
    query[`${type}Items._id`] = new Types.ObjectId(listItemId);
    return this.listModel.updateOne(query, { $set: setUpdate });
  }

  public async removeListItems(listId: string) {
    return this.listModel.updateOne({ _id: listId }, { $set: { listItems: [] } });
  }

  public async removeCartItems(listId: string, user: ListUser) {
    return this.listModel.updateOne({ _id: listId, 'owner._id': user._id }, { $set: { cartItems: [] } });
  }

  public async deleteList(listId: string, user: ListUser) {
    return this.listModel.deleteOne({ _id: listId, 'owner._id': user._id });
  }

  /**
   * Add shared user to list and saved lists
   * @param listId
   * @param sharedUser
   * @param user
   * @returns
   */
  public addSharedUser(listId: string, sharedUser: ListUser, user: ListUser): Observable<any> {
    return from(this.listModel.findOneAndUpdate(
      { _id: listId, 'owner._id': user._id },
      { $push: { sharedUsers: { $each: [sharedUser], $position: 0 } } }, {new: true}
    ).then(res => {
        // add user to saved lists
        this.savedListModel.updateMany(
          { listId },
          { sharedUsers: res.sharedUsers}
        ).exec();
        return(res);
      })
    );
  }

  /**
   * Add an image to list
   * @param listId
   * @param image
   * @returns DB response
   */
  public addImageToList(listId: string, image: string, user: ListUser): Query<ListDocument, ListDocument> {
    return this.listModel.findByIdAndUpdate(
      { _id: listId, 'owner._id': user._id },
      { $push: { images: image } },
      { 'new': true }
    );
  }

  /**
   * Delete all images from list
   * @param listId
   * @returns DB response
   */
  public deleteAllImagesFromList(listId: string): Query<ListDocument, ListDocument> {
    return this.listModel.findByIdAndUpdate(
      { _id: listId },
      { images: [] },
      { 'new': true }
    );
  }

  /**
   * modifyList
   */
  public modifyList(listId: string, fields: any): Query<ListDocument, ListDocument> {
    return this.listModel.findByIdAndUpdate({ _id: listId }, fields, { new: true });
  }
}
