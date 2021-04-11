import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddListDto } from '../dto/add-list.dto';
import { SavedList, SavedListDocument } from './saved-list.schema';

@Injectable()
export class SavedListService {

  constructor(
    @InjectModel(SavedList.name) private readonly savedListModel: Model<SavedListDocument>
    ) {}

    public saveList(list: AddListDto) {
      const savedList = new this.savedListModel(list);
      return savedList.save();
    }
}
