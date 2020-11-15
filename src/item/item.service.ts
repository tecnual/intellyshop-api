import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddItemDto } from './dto/add-item.dto';
import { Item, ItemDocument } from './item.schema';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>) {}

  async add(addItemDto: AddItemDto): Promise<Item> {
    const addedItem = new this.itemModel(addItemDto);
    return addedItem.save();
  }

  async findAll(filter: string): Promise<Item[]> {
    const query = filter || filter === ''? {name: { "$regex": filter, "$options": "i" }} : null
    return this.itemModel.find(query).exec();
  }
}