import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddListDto } from '../dto/add-list.dto';
import { ListUser } from '../list.schema';
import { SavedList, SavedListDocument } from './saved-list.schema';

@Injectable()
export class SavedListService {

  constructor(
    @InjectModel(SavedList.name) private readonly savedListModel: Model<SavedListDocument>
  ) { }

  /**
   * Save list
   * @param list
   * @returns
   */
  public saveList(list: AddListDto): Promise<SavedListDocument> {
    const savedList = new this.savedListModel(list);
    return savedList.save();
  }

  /**
   * Get lists
   * @param user Request user
   * @param filter search filters
   * @param options options parameters
   */
  public getLists(user: ListUser, filter: any, options: any ): Promise<SavedListDocument[]> { // TODO: tipear
    filter['owner._id'] = user._id;
    return this.savedListModel.find(filter, options).sort('createdAt').exec();
  }
}
