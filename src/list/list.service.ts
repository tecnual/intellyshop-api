import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { from, Observable } from 'rxjs';
import { AddListDto, ListFile } from './dto/add-list.dto';
import { List, ListDocument, ListItemDocument, ListUser } from './list.schema';
import { SavedList } from './saved-list/saved-list.schema';
import { InvoiceService } from 'src/invoice/invoice.service';
import { Invoice } from 'src/invoice/models/invoice.schema';
import { FireflyIIIService } from 'src/routes/finance/infrastructure/firefly-iii/firefly-iii.service';
import { AddTransactionRequestMapper } from 'src/routes/finance/domain/mappers/add-transaction.request.mapper';
import { User } from 'src/core/user/user.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name) private readonly listModel: Model<List>,
    @InjectModel(SavedList.name)
    private readonly savedListModel: Model<SavedList>,
    private readonly invoiceService: InvoiceService,
    private readonly fireflyIIIService: FireflyIIIService,
    private readonly logger: Logger
  ) {}

  async upsert(listToAdd: AddListDto, user: ListUser): Promise<any> {
    listToAdd.owner = user;
    const addedList = new this.listModel(listToAdd);
    const result: ListDocument = await this.listModel
      .findOneAndUpdate({ _id: addedList._id }, addedList, {
        new: true,
        upsert: true
      })
      .exec();
    await this.savedListModel.updateMany({ listId: result._id }, { tags: result.tags }).exec();
    return result;
  }

  async getUserLists(user: ListUser): Promise<any[]> {
    const lists = await this.listModel
      .find({ 'owner._id': user._id })
      .populate({
        path: 'invoices',
        model: 'Invoice',
        populate: {
          path: 'lines.item_id',
          model: 'Item'
        }
      })
      .exec();
    return lists;
  }

  /**
   * Add items to items list
   * @param listId
   * @param listItem
   * @param user
   * @returns
   */
  public addItemToItemsList(listId: string, listItem: ListItemDocument, user: ListUser): Observable<any> {
    listItem._id = new Types.ObjectId();
    return from(
      this.listModel.updateOne({ _id: listId, 'owner._id': user._id }, { $push: { listItems: { $each: [listItem], $position: 0 } } })
    );
  }

  /**
   * Add items to list cart
   * @param listId
   * @param cartItem
   * @param user
   * @returns
   */
  public addItemToListCart(listId: string, cartItem: ListItemDocument, user: ListUser): Observable<any> {
    cartItem._id = new Types.ObjectId();
    return from(
      this.listModel.updateOne({ _id: listId, 'owner._id': user._id }, { $push: { cartItems: { $each: [cartItem], $position: 0 } } })
    );
  }

  /**
   * Remove items from items list
   * @param listId
   * @param listItemId
   * @param user
   * @returns
   */
  public async removeItemFromList(listId: string, listItemId: string, user: ListUser) {
    return this.listModel.updateOne(
      { _id: listId, 'owner._id': user._id },
      { $pull: { listItems: { _id: new Types.ObjectId(listItemId) } } }
    );
  }

  /**
   * Remove items from cart list
   * @param listId
   * @param cartItemId
   * @param user
   * @returns
   */
  public removeItemFromCartList(listId: string, cartItemId: any, user: ListUser) {
    return this.listModel.updateOne(
      { _id: listId, 'owner._id': user._id },
      { $pull: { cartItems: { _id: new Types.ObjectId(cartItemId) } } }
    );
  }

  /**
   * Update item from list
   * @param listId
   * @param listItemId
   * @param listItem
   * @param type
   * @param user
   * @returns
   */
  public async updateItemFromList(listId: string, listItemId: string, listItem: any, type: string, user: ListUser) {
    const setUpdate: any = {};
    listItem.name ? (setUpdate[type + 'Items.$.name'] = listItem.name) : null;
    listItem.itemId ? (setUpdate[type + 'Items.$.itemId'] = listItem.itemId) : null;
    listItem.quantity ? (setUpdate[type + 'Items.$.quantity'] = Number(listItem.quantity)) : null;
    listItem.price ? (setUpdate[type + 'Items.$.price'] = Number(listItem.price)) : null;

    const query = { _id: listId, 'owner._id': user._id };
    query[`${type}Items._id`] = new Types.ObjectId(listItemId);
    return this.listModel.updateOne(query, { $set: setUpdate });
  }

  /**
   * remove list Items
   * @param listId
   * @param user
   * @returns
   */
  public async removeListItems(listId: string, user: ListUser) {
    return this.listModel.updateOne({ _id: listId, 'owner._id': user._id }, { $set: { listItems: [] } });
  }

  /**
   * Remove cart items
   * @param listId
   * @param user
   * @returns
   */
  public async removeCartItems(listId: string, user: ListUser) {
    return this.listModel.updateOne({ _id: listId, 'owner._id': user._id }, { $set: { cartItems: [] } });
  }

  /**
   * Delete list
   * @param listId
   * @param user
   * @returns
   */
  public async deleteList(listId: string, user: ListUser) {
    return this.listModel.deleteOne({ _id: listId, 'owner._id': user._id });
  }

  /**
   * Add shared user to list and saved lists
   * @param listId
   * @param sharedUser
   * @param user
   * @returns
   */
  public addSharedUser(listId: string, sharedUser: ListUser, user: ListUser): Observable<any> {
    return from(
      this.listModel
        .findOneAndUpdate(
          { _id: listId, 'owner._id': user._id },
          { $push: { sharedUsers: { $each: [sharedUser], $position: 0 } } },
          { new: true }
        )
        .then((res) => {
          // add user to saved lists
          this.savedListModel.updateMany({ listId }, { sharedUsers: res.sharedUsers }).exec();
          return res;
        })
    );
  }

  /**
   * Add an image to list
   * @param listId
   * @param image
   * @returns DB response
   */
  public addImageToList(listId: string, image: string, user: ListUser): Query<ListDocument, ListDocument> {
    return this.listModel.findByIdAndUpdate({ _id: listId, 'owner._id': user._id }, { $push: { images: image } }, { new: true });
  }

  /**
   * Delete all images from list
   * @param listId
   * @returns DB response
   */
  public deleteAllImagesFromList(listId: string): Query<ListDocument, ListDocument> {
    return this.listModel.findByIdAndUpdate({ _id: listId }, { images: [] }, { new: true });
  }

  /**
   * Modify list
   * @param listId
   * @param fields
   * @returns
   */
  public modifyList(listId: string, fields: any): Query<ListDocument, ListDocument> {
    return this.listModel.findByIdAndUpdate({ _id: listId }, fields, {
      new: true
    });
  }

  /**
   * Add files to list
   * @param listId
   * @param files
   * @returns DB response
   */
  public addFileToList(listId: string, file: ListFile, user: ListUser): Query<ListDocument, ListDocument> {
    return this.listModel.findByIdAndUpdate({ _id: listId, 'owner._id': user._id }, { $push: { files: file } }, { new: true });
  }

  /**
   * Add invoices   * @param listId
   * @param files
   * @returns DB response
   */
  public async addInvoiceFromFile(list_id: string, file: ListFile, user: User, firefly: any): Promise<ListFile | boolean> {
    // this.logger.debug('file', file);
    const invoice: Invoice = await this.invoiceService.invoiceFromFile(file, list_id, user._id);
    const invoiceFound = await this.invoiceService.getInvoiceByNumber(invoice.number);
    if (invoiceFound) {
      return false;
    } else {
      const resultInvoice = await this.invoiceService.addNewInvoice(invoice);
      await this.addInvoiceToList(list_id, user._id, resultInvoice._id);
      if (firefly && resultInvoice) this.addInvoiceToFireFlyIII(invoice, firefly, user);
      file.invoice_id = resultInvoice._id;
      return file;
    }
  }

  /**
   * Add invoice to list
   * @param listId
   * @param invoice
   * @returns DB response
   */
  public addInvoiceToList(listId: string, user_id: Types.ObjectId, invoice_id: Types.ObjectId): Query<ListDocument, ListDocument> {
    return this.listModel.findByIdAndUpdate({ _id: listId, 'owner._id': user_id }, { $push: { invoices: invoice_id } }, { new: true });
  }

  public addInvoiceToFireFlyIII(invoice: Invoice, firefly: any, user: User): void {
    const addTransactionRequestMapper = new AddTransactionRequestMapper();
    const addTransactionRequest = addTransactionRequestMapper.invoiceToTransacction(invoice, firefly);
    this.fireflyIIIService.addTransaccion(addTransactionRequest, user).subscribe({
      next: (res) => {
        invoice.ffId = res.data.data.id;
      },
      error: (err) => {
        console.error('Error: ', err.data);
      }
    });
  }
}
