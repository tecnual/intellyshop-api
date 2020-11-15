import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { AddListDto } from './dto/add-list.dto';
import { List, ListDocument, ListItemDocument } from './list.schema';

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
    return from(this.listModel.updateOne(
      { _id: listId },
      { $push: { listItems: listItem} }
    ));
  }

  public addItemToListCart(listId: string, cartItem: ListItemDocument): Observable<any> {
    console.log(cartItem);
    return from(this.listModel.updateOne(
      { _id: listId },
      { $push: { cartItems: cartItem} }
    ));
  }

  public removeItemFromList(listId: string, listItemId: any) {
    return this.listModel.updateOne({_id: listId}, { $pull: {listItems: { _id: listItemId}}});
  }

  public removeItemFromListCart(listId: string, cartItemId: any) {
    return this.listModel.updateOne({_id: listId}, { $pull: {cartItems: { _id: cartItemId}}});
  }
}
