import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { AddListDto } from './dto/add-list.dto';
import { List, ListDocument, ListItemDocument } from './list.schema';

@Injectable()
export class ListService {
  constructor(@InjectModel(List.name) private readonly listModel: Model<ListDocument>) {}

  async add(addListDto: AddListDto): Promise<List> {
    const addedList = new this.listModel(addListDto);
    return addedList.save();
  }

  async findAll(): Promise<List[]> {
    return this.listModel.find().exec();
  }

  addItemToList(listId: string, listItem: ListItemDocument ): Observable<any> {
    return from(this.listModel.updateOne(
      { _id: listId }, 
      { $push: { items: listItem} }
    ));
  }
}