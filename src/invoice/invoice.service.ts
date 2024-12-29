import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceLine, InvoiceType, UnitType } from './models/invoice.schema';

import * as pdf2table from 'pdf2table';
import { InvoiceLineDTO } from './models/invoice-line.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserDocument } from 'src/core/user/user.schema';
import { ItemService } from 'src/item/item.service';
import { OpenFFService } from 'src/shared/openFF/openFF.Service';
import { Item, ItemDocument } from 'src/item/item.schema';
import { Price, Source } from 'src/item/price.schema';
import { ListFile } from 'src/list/dto/add-list.dto';
import { createWorker } from 'tesseract.js';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly itemService: ItemService,
    private readonly openFFService: OpenFFService,
    private readonly logger: Logger
  ) {}

  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    return await this.invoiceModel.findById(new Types.ObjectId(invoiceId)).populate({ path: 'lines.item_id', model: 'Item' });
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice> {
    return await this.invoiceModel.findOne({ number: invoiceNumber });
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
          this.logger.warn(error, 'Product not found: ');
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
      if (invoiceLineReq.item_id) {
        item._id = invoiceLineReq.item_id;
        //item.barcode = invoiceLineReq.barcode;
        item.altNames = await this.mergeArrays(item.altNames, invoiceLineReq.item_id.altNames);
      }
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

  async invoiceFromFile(file: ListFile, list_id, user_id): Promise<Invoice> {
    let data;
    if (file.mimeType.includes('image')) {
      data = await this.getDataFromImage(file.file);
    } else {
      data = await this.getDataFromFile(file.file);
    }

    return await this.getInvoiceFromData(data, list_id, user_id);
  }

  async getDataFromFile(base64File): Promise<Invoice> {
    const base64Data = base64File.replace(/^data:application\/pdf;base64,/, '');
    return new Promise((resolve) => {
      const bufferObj = this.base64ToArrayBuffer(base64Data);
      pdf2table.parse(bufferObj, (response, rows) => resolve(rows));
    });
  }

  async getDataFromImage(base64Image): Promise<Invoice> {
    let data;
    try {
      const worker = await createWorker('spa');
      await worker.setParameters({
        preserve_interword_spaces: '1'
      });
      const {
        data: { text }
      } = await worker.recognize(base64Image);
      data = text.split('\n');
      worker.terminate();
    } catch (error) {
      this.logger.error(error);
    }
    return data;
  }

  getInvoiceType(data: any): InvoiceType {
    if (data[0][0] === 'ALIMERKA S.A.U.') {
      return InvoiceType.ALIMERKA;
    }
    const mercadonaName = data[0][0].split('  ')[0];
    if (mercadonaName === 'MERCADONA, S.A.') {
      return InvoiceType.MERCADONA;
    }
    if (data[1] === 'LIDL SUPERMERCADOS S.A.U') {
      return InvoiceType.LIDL;
    }
    return InvoiceType.GENERIC;
  }

  async getInvoiceFromData(data, list_id, user_id): Promise<Invoice> {
    const invoiceType = this.getInvoiceType(data);
    switch (invoiceType) {
      case InvoiceType.MERCADONA: {
        return await this.parseDataFromMercadona(data, list_id, user_id);
      }
      case InvoiceType.ALIMERKA: {
        return await this.parseDataFromAlimerka(data, list_id, user_id);
      }
      case InvoiceType.LIDL: {
        return await this.parseDataFromLidl(data, list_id, user_id);
      }
      default: {
        return null;
      }
    }
  }

  async getInvoiceLinesFromMercadona(data, totalLineNumber, date: Date, invoiceId) {
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

        if (item?._id) {
          invoiceLine.item_id = new Types.ObjectId(item._id);
        }
      }
      const price = new Price(invoiceLine.price, user._id, Source.INVOICE, 'EUR', date, null, invoiceId);
      if (item) {
        const itemId = item._id.toString();
        await this.itemService.patchItemPrice(itemId, invoiceLine.price);
        if (item.altNames.indexOf(invoiceLine.description) > -1) await this.itemService.addItemAltName(itemId, invoiceLine.description);
        await this.itemService.addPriceToItem(item._id.toString(), price);
        invoiceLine.item_id = item._id;
        invoiceLine.barcode = item.barcode;
        invoiceLine.increment = item.price - invoiceLine.price;
      } else {
        const newItem = new Item(
          invoiceLine.description,
          [invoiceLine.description],
          null,
          null,
          null,
          true,
          user._id,
          user._id,
          invoiceLine.price,
          [price],
          new Date()
        );
        const resultItem = await this.itemService.setItem(newItem as ItemDocument, user._id);
        invoiceLine.item_id = resultItem._id;
      }
      invoiceLines.push(invoiceLine);
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
    const invoiceLineId = new Types.ObjectId(invoiceLine._id);
    const lineItemId = new Types.ObjectId(itemId);
    return this.invoiceModel
      .findOneAndUpdate(
        { 'lines._id': invoiceLineId },
        { $set: { 'lines.$.item_id': lineItemId, 'lines.$.barcode': invoiceLine.barcode } },
        {
          upsert: false,
          new: true
        }
      )
      .populate({ path: 'lines.item_id', model: 'Item' })
      .exec();
  }

  async mergeArrays(source: any[], arrayToMerge: any[]) {
    const mergedArray: any[] = [];
    source.map((elem) => {
      const result = arrayToMerge.some((i) => {
        return i === elem;
      });
      if (!result) mergedArray.push(elem);
    });
    return [...arrayToMerge, ...mergedArray];
  }

  async parseDataFromMercadona(data, list_id, user_id): Promise<Invoice> {
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
    const lines = await this.getInvoiceLinesFromMercadona(data, totalLineNumber, date, invoiceId);
    const invoice: Invoice = new Invoice(invoiceNumber, lines, 'EUR', total, date, list_id, user_id, invoiceId, InvoiceType.MERCADONA);
    return invoice;
  }

  async parseDataFromAlimerka(data, list_id, user_id): Promise<Invoice> {
    // TODO: Check several pages
    const ticketDateArray = data[0][2].split('/');
    const invoiceNumber = data[7][0];
    const date = new Date(ticketDateArray[2], ticketDateArray[1] - 1, ticketDateArray[0]);
    const invoiceId = new Types.ObjectId();
    const lines = await this.getInvoiceLinesFromAlimerka(data, date, invoiceId);
    const totalField = data.find((line) => line[1] === 'PAGO CONTADO');
    const total = totalField[0].replace(',', '.') as number;

    const invoice: Invoice = new Invoice(invoiceNumber, lines, 'EUR', total, date, list_id, user_id, invoiceId, InvoiceType.ALIMERKA);
    return invoice;
  }

  async getInvoiceLinesFromAlimerka(data, date: Date, invoiceId) {
    const lines = data.filter((line) => line.length === 9 && line[0] !== 'Código de ' && line[0] !== 'artículo');
    const user = this.request.user as UserDocument;
    const invoiceLines: InvoiceLine[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const item = await this.itemService.findOneByName(line[1]);

      let unitType = UnitType.UNIT;
      if (line[3] === 'UN') unitType = UnitType.UNIT;
      if (line[3] === 'KG') unitType = UnitType.KG;
      const invoiceLine: InvoiceLine = {
        _id: new Types.ObjectId(),
        quantity: line[2].replace(',', '.') as number,
        description: line[1],
        price: line[4].replace(',', '.') as number,
        unitType
      };

      if (item?._id) {
        invoiceLine.item_id = new Types.ObjectId(item._id);
      }

      const price = new Price(invoiceLine.price, user._id, Source.INVOICE, 'EUR', date, null, invoiceId);
      if (item) {
        const itemId = item._id.toString();
        await this.itemService.patchItemPrice(itemId, invoiceLine.price);
        if (item.altNames.indexOf(invoiceLine.description) > -1) await this.itemService.addItemAltName(itemId, invoiceLine.description);
        await this.itemService.addPriceToItem(item._id.toString(), price);
        invoiceLine.item_id = item._id;
        invoiceLine.barcode = item.barcode;
      } else {
        const newItem = new Item(
          invoiceLine.description,
          [invoiceLine.description],
          null,
          null,
          null,
          true,
          user._id,
          user._id,
          invoiceLine.price,
          [price],
          new Date()
        );
        const resultItem = await this.itemService.setItem(newItem as ItemDocument, user._id);
        invoiceLine.item_id = resultItem._id;
      }
      invoiceLines.push(invoiceLine);
    }
    return invoiceLines;
  }

  async parseDataFromLidl(data, list_id, user_id): Promise<Invoice> {
    // TODO: Check several pages
    //const ticketDate = ticketDateArray[0].split('/');
    this.logger.debug(data, 'Line text');
    const totalLine = data.find((line) => line.startsWith('Total'));
    const endLinesNumber = data.indexOf(totalLine);
    this.logger.debug(totalLine, 'totalLine');
    this.logger.debug(endLinesNumber, 'endLinesNumber');
    const totalField = totalLine.split(' ');
    const total = parseFloat(totalField[totalField.length - 1].replace(',', '.'));
    this.logger.debug(total, 'total');
    const ticketDateArray = data[endLinesNumber + 6].split(' ')[0].split('/');

    const invoiceField = data
      .find((l, i) => {
        return data[i + 1]?.includes('Devoluciones art');
      })
      .split('  ');
    const invoiceNumber = invoiceField[1];
    this.logger.debug(invoiceNumber, 'invoiceNumber');

    const date = new Date(ticketDateArray[2], ticketDateArray[1] - 1, ticketDateArray[0]);
    this.logger.debug(date, 'date');
    const invoiceId = new Types.ObjectId();
    const lines = await this.getInvoiceLinesFromLidl(data, date, endLinesNumber, invoiceId);

    const invoice: Invoice = new Invoice(invoiceNumber, lines, 'EUR', total, date, list_id, user_id, invoiceId, InvoiceType.ALIMERKA);
    return invoice;
  }

  async getInvoiceLinesFromLidl(data, date: Date, endLinesNumber: number, invoiceId) {
    //const lines = data.filter((line, index) => index > 5 && index < endLinesNumber);
    const lines = [];
    data.map((l, i) => {
      if (i > 5 && i < endLinesNumber) {
        const line = l.split('  ').filter((elem) => elem !== '');
        if (!line[0].includes('Dto. Lidl') && !line[0].includes('EUR/kg')) {
          let discount: number = 0;

          if (data[i + 1].includes('Dto. Lidl')) {
            const discountLine = data[i + 1].split('  ');
            discount = parseFloat(discountLine[discountLine.length - 1].replace(',', '.'));
          }
          let price: number = 0;
          let descriptionLine = '';
          let quantity = 0;
          let unitType = UnitType.UNIT;

          if (data[i + 1].includes('EUR/kg')) {
            unitType = UnitType.KG;
            const lineField = data[i + 1].split(' ');
            quantity = parseFloat(lineField[0].replace(',', '.'));
            price = parseFloat(lineField[3].replace(',', '.'));
            descriptionLine = line[0];
          } else {
            if (line.length === 2) {
              price = parseFloat(line[line.length - 1].replace(',', '.'));
              //lines.push([line[0], 1, price]);
              descriptionLine = line[0];
              quantity = 1;
            } else {
              const descriptionField = line[0].split(' ');
              const priceField = descriptionField[descriptionField.length - 1];
              price = parseFloat(priceField.replace(',', '.').replace('$', ''));
              descriptionLine = line[0].replace(' ' + priceField, '');
              quantity = parseInt(line[line.length - 2]);
            }
          }
          const descriptionField = descriptionLine.split('/');
          let description = '';
          let brand = '';
          if (descriptionField.length > 1) {
            description = descriptionField[1];
            brand = descriptionField[0];
          } else {
            description = descriptionField[0];
            brand = '';
          }
          //const description = descriptionField.length > 1 ? descriptionField[1] : descriptionField[0];
          price = price + discount;
          lines.push({ description, quantity, price, unitType, discount, brand });
        }
      }
    });
    this.logger.debug(lines, 'lines');

    const user = this.request.user as UserDocument;
    const invoiceLines: InvoiceLine[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const item = await this.itemService.findOneByName(line.description);

      const invoiceLine: InvoiceLine = {
        _id: new Types.ObjectId(),
        quantity: line.quantity,
        description: line.description,
        price: line.price,
        unitType: line.unitType
      };

      if (item?._id) {
        invoiceLine.item_id = new Types.ObjectId(item._id);
      }

      const price = new Price(invoiceLine.price, user._id, Source.INVOICE, 'EUR', date, null, invoiceId);
      if (item) {
        const itemId = item._id.toString();
        await this.itemService.patchItemPrice(itemId, invoiceLine.price);
        if (item.altNames.indexOf(invoiceLine.description) > -1) await this.itemService.addItemAltName(itemId, invoiceLine.description);
        await this.itemService.addPriceToItem(item._id.toString(), price);
        invoiceLine.item_id = item._id;
        invoiceLine.barcode = item.barcode;
      } else {
        const newItem = new Item(
          invoiceLine.description,
          [invoiceLine.description],
          null,
          null,
          null,
          true,
          user._id,
          user._id,
          invoiceLine.price,
          [price],
          new Date(),
          line.brand
        );
        const resultItem = await this.itemService.setItem(newItem as ItemDocument, user._id);
        invoiceLine.item_id = resultItem._id;
      }
      invoiceLines.push(invoiceLine);
    }
    //throw new Error('Something bad happened'); //TODO: BORRAR

    return invoiceLines;
  }
}
