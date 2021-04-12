import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SavedList, SavedListDocument } from 'src/list/saved-list/saved-list.schema';

@Injectable()
export class FinanceService {

constructor(
  @InjectModel(SavedList.name) private readonly savedListModel: Model<SavedListDocument>
) {}
  /**
   * getStats
   */
  public getStats(): any { // TODO: tipear
    return this.savedListModel.find({}, {totals: 1, createdAt: 1}).exec();
  }
}
