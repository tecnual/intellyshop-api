import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from './item.schema';
import { Price } from './price.schema';
import { ListUser } from 'src/list/list.schema';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>
  ) {}

  async setItem(item: ItemDocument): Promise<Item> {
    if (!item._id) item._id = new Types.ObjectId();
    return this.itemModel.findByIdAndUpdate(item._id, item, {
      upsert: true,
      new: true
    });
  }

  async findOneById(itemId: string): Promise<Item> {
    return this.itemModel.findById(itemId).exec();
  }

  async findAllByName(filter: string): Promise<Item[]> {
    const query =
      filter || filter === ''
        ? { name: { $regex: filter, $options: 'i' } }
        : null;
    return this.itemModel.find(query).exec();
  }

  async findOneByBarcode(barcode: string): Promise<Item> {
    return this.itemModel.findOne({ barcode }).exec();
  }

  async patchItem(itemId: string, item: Item): Promise<any> {
    return this.itemModel.updateOne(
      { _id: itemId },
      { $set: { price: item.price, name: item.name } }
    );
  }

  async setPrices(itemPrices: any[], itemId, user, source): Promise<Price[]> {
    const prices: Price[] = this.mapPrices(itemPrices, user, source);
    const currentDate: Date = new Date();
    if (prices.length > 0) {
      await this.itemModel.findByIdAndUpdate(
        { _id: itemId },
        { $set: { prices: prices, lastPriceUpdateDate: currentDate } }
      );
    }
    return prices;
  }

  mapPrices(prices, user: ListUser, source: string): Price[] {
    const itemPrices: Price[] = [];
    prices.forEach((elem) => {
      itemPrices.push(new Price(elem.price, user, source, elem.currency, elem));
    });
    return itemPrices;
  }
}
