import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from './item.schema';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>) {}

  async setItem(item: ItemDocument): Promise<Item> {
    if (!item._id) item._id = new Types.ObjectId();
    return this.itemModel.findByIdAndUpdate(item._id, item, { upsert: true, new: true });
  }

  async findOneById(itemId: string): Promise<Item> {
    return this.itemModel.findById(itemId).exec();
  }

  async findAllByName(filter: string): Promise<Item[]> {
    const query = filter || filter === ''? {name: { "$regex": filter, "$options": "i" }} : null;
    return this.itemModel.find(query).exec();
  }

  async findOneByBarcode(barcode: string): Promise<Item> {
    return this.itemModel.findOne({barcode}).exec();
  }

  async patchItem(itemId: string, item: Item): Promise<Item> {
    return this.itemModel.updateOne({_id: itemId}, {$set: {price: item.price, name: item.name}});
  }
}
