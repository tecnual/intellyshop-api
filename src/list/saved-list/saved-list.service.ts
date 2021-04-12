import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddListDto } from '../dto/add-list.dto';
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
  */
  public getLists(options: any): Promise<SavedListDocument[]> { // TODO: tipear
    return this.savedListModel.find({}, options).sort('createdAt').exec();
  }
}
