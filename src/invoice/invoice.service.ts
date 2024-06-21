import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceLine, UnitType } from './models/invoice.schema';

import * as pdf2table from 'pdf2table';
import { InvoiceLineDTO } from './models/invoice-line.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserDocument } from 'src/core/user/user.schema';
import { ItemService } from 'src/item/item.service';
import { OpenFFService } from 'src/shared/openFF/openFF.Service';
import { Item, ItemDocument } from 'src/item/item.schema';
import { Price, Source } from 'src/item/price.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly itemService: ItemService,
    private readonly openFFService: OpenFFService
  ) {}

  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    return await this.invoiceModel.findById(new Types.ObjectId(invoiceId)).populate({ path: 'lines.item_id', model: 'Item' });
  }

  async setInvoiceLine(invoice: Invoice, invoiceLineReq: InvoiceLineDTO): Promise<InvoiceLine> {
    const user = this.request.user as UserDocument;
    const userId = new Types.ObjectId(user._id.toString());

    let itemResult = await this.itemService.findOneByBarcode(invoiceLineReq.barcode);
    let prices = [];
    if (!itemResult) {
      let item;
      await this.openFFService
        .getProductByBarcode(invoiceLineReq.barcode)
        .then(async (product) => {
          let lastPrice = null;
          if (product.data && product.data.price_count > 0) {
            const pricesResult = await this.openFFService.getProductPricesByBarcode(invoiceLineReq.barcode);
            if (pricesResult.data.total > 0) {
              prices = await this.itemService.mapPricesFromOpenFF(pricesResult.data.items, userId, []);
              lastPrice = await this.openFFService.getLastPrice(prices);
            }
          }
          prices.push(new Price(invoiceLineReq.price, userId, Source.INVOICE, 'EUR', invoice.date));
          item = new Item(
            product.data.product_name,
            [product.data.product_name, invoiceLineReq.description],
            invoiceLineReq.barcode,
            product.data,
            null,
            true,
            userId,
            userId,
            lastPrice,
            prices,
            new Date()
          );
        })
        .catch((error) => {
          console.error('Error en producto: ', error);
          const newPrices: Price[] = [];
          newPrices.push(new Price(invoiceLineReq.price, userId, Source.INVOICE, 'EUR', invoice.date, null, invoice._id));
          item = new Item(
            invoiceLineReq.description,
            [invoiceLineReq.description],
            invoiceLineReq.barcode,
            null,
            null,
            true,
            userId,
            userId,
            invoiceLineReq.price,
            newPrices,
            new Date()
          );
        });
      itemResult = await this.itemService.setItem(item as ItemDocument, user._id);
    } else {
      const prices: Price[] = [];
      prices.push(new Price(invoiceLineReq.price, userId, Source.INVOICE, 'EUR', invoice.date));
      const totalPrices = this.itemService.addPricesToItemPrices(prices, itemResult.prices);
      this.itemService.setPricesToItem(itemResult._id.toString(), totalPrices);
    }

    const invoiceRes = await this.updateInvoiceLine(invoiceLineReq, itemResult._id);
    const invoiceLineRes: InvoiceLine = invoiceRes.lines.find((line) => line._id.toString() === invoiceLineReq._id);
    return invoiceLineRes;
  }

  async addNewInvoice(invoice: Invoice) {
    const newInvoice = new this.invoiceModel(invoice);
    return newInvoice.save();
  }

  async invoiceFromFile(base64File, list_id, user_id): Promise<Invoice> {
    const data = await this.getDataFromFile(base64File);
    return await this.getInvoiceFromData(data, list_id, user_id);
  }

  async getDataFromFile(base64File): Promise<Invoice> {
    const base64Data = base64File.replace(/^data:application\/pdf;base64,/, '');
    return new Promise((resolve) => {
      const bufferObj = this.base64ToArrayBuffer(base64Data);
      pdf2table.parse(bufferObj, (response, rows) => resolve(rows));
    });
  }

  async getInvoiceFromData(data, list_id, user_id): Promise<Invoice> {
    // const store = data[0][0].split('  ');
    // const storeName = store[0];
    // const storeCIF = store[1];
    // const storeAddress = data[1];
    const ticketDateArray = data[4][0].split(' ');
    const ticketDate = ticketDateArray[0].split('/');
    const ticketHour = ticketDateArray[1].split(':');
    const invoiceNumber = data[5][0].split(': ')[1];
    const date = new Date(ticketDate[2], ticketDate[1] - 1, ticketDate[0], ticketHour[0], ticketHour[1]);
    let total = 0;
    let totalLineNumber = 0;
    let count = 0;

    data.map((elem) => {
      count++;
      if (elem[0] === 'TOTAL (€)') {
        total = elem[1].replace(',', '.') as number;
        totalLineNumber = count;
      }
    });
    const invoiceId = new Types.ObjectId();
    const lines = await this.getInvoiceLines(data, totalLineNumber, date, invoiceId);
    const invoice: Invoice = new Invoice(invoiceNumber, lines, 'EUR', total, date, list_id, user_id, invoiceId);
    return invoice;
  }

  async getInvoiceLines(data, totalLineNumber, date: Date, invoiceId) {
    const user = this.request.user as UserDocument;
    const invoiceLines: InvoiceLine[] = [];

    for (let i = 7; i < totalLineNumber - 1; i++) {
      const line = data[i];
      const item = await this.itemService.findOneByName(line[1]);
      let invoiceLine: InvoiceLine;
      if (line.length <= 4) {
        invoiceLine = {
          _id: new Types.ObjectId(),
          quantity: line[0] as number,
          description: line[1],
          price: line[2].replace(',', '.') as number,
          unitType: UnitType.UNIT
        };
        if (item?._id) invoiceLine.item_id = new Types.ObjectId(item._id);
        invoiceLines.push(invoiceLine);
      }
      if (line.length >= 5) {
        const priceArray = line[3].split(' ');
        invoiceLine = {
          _id: new Types.ObjectId(),
          quantity: line[2].replace(',', '.').split(' ')[0] as number,
          description: line[1],
          price: priceArray[0].replace(',', '.'),
          unitType: priceArray[1].split('/')[1]
        };

        if (item?._id) invoiceLine.item_id = new Types.ObjectId(item._id);
        invoiceLines.push(invoiceLine);
      }
      if (item) {
        const itemId = item._id.toString();
        await this.itemService.patchItemPrice(itemId, invoiceLine.price);
        if (item.altNames.indexOf(invoiceLine.description) > -1) await this.itemService.addItemAltName(itemId, invoiceLine.description);
        const price = new Price(invoiceLine.price, user._id, Source.INVOICE, 'EUR', date, null, invoiceId);
        await this.itemService.addPriceToItem(item._id.toString(), price);
      }
    }
    return invoiceLines;
  }

  base64ToArrayBuffer(base64File) {
    const binaryString = atob(base64File);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public async updateInvoiceLine(invoiceLine: InvoiceLineDTO, itemId: Types.ObjectId) {
    const invoiceId = new Types.ObjectId(invoiceLine._id);
    const lineItemId = new Types.ObjectId(itemId);
    return this.invoiceModel
      .findOneAndUpdate(
        { 'lines._id': invoiceId },
        { $set: { 'lines.$.item_id': lineItemId } },
        {
          upsert: false,
          new: true
        }
      )
      .populate({ path: 'lines.item_id', model: 'Item' })
      .exec();
  }
}
