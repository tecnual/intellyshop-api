import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from './item.schema';
import { Price, Source } from './price.schema';
import { OpenFFService } from 'src/shared/openFF/openFF.Service';
@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    private readonly openFFService: OpenFFService
  ) {}

  async setItem(item: ItemDocument, userId: Types.ObjectId): Promise<ItemDocument> {
    let oFFPrices;
    let prices: Price[];
    if (!item._id) {
      item._id = new Types.ObjectId();
      if (item.barcode) {
        oFFPrices = await this.openFFService.getProductPricesByBarcode(item.barcode);
        prices = this.mapPricesFromOpenFF(oFFPrices.data.items, userId, []);
        item.price = await this.getLastPrice(prices);
        item.lastPriceUpdateDate = new Date();
        item.prices = prices;
      }
    }
    return this.itemModel.findByIdAndUpdate(item._id, item, {
      upsert: true,
      new: true
    });
  }

  async findOneById(itemId: string): Promise<Item> {
    return this.itemModel.findById(new Types.ObjectId(itemId)).exec();
  }

  async findAllByName(filter: string): Promise<Item[]> {
    const query = filter || filter === '' ? { $text: { $search: filter } } : null;
    const result = this.itemModel.find(query).exec();
    console.log('result: ', result);
    return result;
  }

  async findOneByName(filter: string): Promise<ItemDocument> {
    const query = filter || filter === '' ? { altNames: filter } : null;
    return this.itemModel.findOne(query).exec();
  }

  async findOneByBarcode(barcode: string): Promise<ItemDocument> {
    return this.itemModel.findOne({ barcode }).exec();
  }

  async patchItem(itemId: string, item: Item): Promise<any> {
    return this.itemModel.updateOne({ _id: itemId }, { $set: { price: item.price, name: item.name } });
  }

  async patchItemPrice(itemId: string, price: number): Promise<any> {
    return this.itemModel.updateOne({ _id: itemId }, { $set: { price: price } });
  }

  async addItemAltName(_id: string, name: string): Promise<any> {
    return this.itemModel.findOneAndUpdate({ _id }, { $addToSet: { altNames: name } });
  }

  async addPriceToItem(itemId: string, price: Price): Promise<any> {
    price.createdBy = new Types.ObjectId(price.createdBy);
    return this.itemModel.findOneAndUpdate({ _id: itemId }, { $set: { price: price.price }, $push: { prices: price } });
  }

  async setPricesFromOpenFF(itemPrices: any[], itemId, user): Promise<Price[]> {
    const prices: Price[] = this.mapPricesFromOpenFF(itemPrices, user, []);
    const currentDate: Date = new Date();
    if (prices.length > 0) {
      await this.itemModel.findByIdAndUpdate({ _id: itemId }, { $set: { prices: prices, lastPriceUpdateDate: currentDate } });
    }
    return prices;
  }

  mapPricesFromOpenFF(prices: any[], userId: Types.ObjectId, itemPrices): Price[] {
    if (!itemPrices) itemPrices = [];
    prices.forEach((elem) => {
      const priceFound = itemPrices.find((p) => p.price === elem.price && p.date === elem.date);
      if (!priceFound) {
        itemPrices.push(new Price(elem.price, userId, Source.OPEN_FOOD_FACTS, elem.currency, elem.date, elem));
      }
    });
    return itemPrices;
  }

  public async setPricesToItem(itemId: string, prices: Price[]) {
    return this.itemModel.findByIdAndUpdate(itemId, { $set: { prices, lastPriceUpdateDate: new Date() } }, { new: true }).exec();
  }

  addPricesToItemPrices(prices: Price[], itemPrices): Price[] {
    if (!itemPrices) itemPrices = [];
    prices.forEach((elem) => {
      const priceFound = itemPrices.find((p) => p.price === elem.price && p.date === elem.date);
      if (!priceFound) {
        itemPrices.push(elem);
      }
    });
    return itemPrices;
  }

  public async getLastPrice(prices: any[]) {
    const lastPrice = await prices.reduce((a, b) => (new Date(a.date) > new Date(b.date) ? a : b), { date: '1977-08-12' });
    return lastPrice.price;
  }
}
