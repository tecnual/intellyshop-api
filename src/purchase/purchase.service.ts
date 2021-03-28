import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase, PurchaseDocument } from './purchase.schema';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name) private readonly purchaseModel: Model<PurchaseDocument>
  ) {}
  public add(user: any, data: any): Promise<Purchase> {
    const addPurchase: Purchase = new Purchase();
    addPurchase.user = user;
    addPurchase.list = data.listId;
    addPurchase.listItems = data.listItems;
    addPurchase.totalPrice = data.totalPrice;
    addPurchase.totalQuantity = data.totalQuantity;
    addPurchase.ticket = data.ticket;

    const purchaseAdded = new this.purchaseModel(addPurchase);

    return purchaseAdded.save();
  }
}
