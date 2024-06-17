import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceLine, UnitType } from './invoice.schema';

import * as pdf2table from 'pdf2table';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>
  ) {}

  async addNewInvoice(invoice: Invoice) {
    invoice._id = new Types.ObjectId();
    return this.invoiceModel.create(invoice);
  }

  async addInvoiceFromFile(base64File, list_id, user_id): Promise<Invoice> {
    const data = await this.getDataFromFile(base64File);
    //console.log('Factura: ', data);
    return this.getInvoiceFromData(data, list_id, user_id);
  }

  async getDataFromFile(base64File): Promise<Invoice> {
    const base64Data = base64File.replace(/^data:application\/pdf;base64,/, '');
    return new Promise((resolve) => {
      const bufferObj = this.base64ToArrayBuffer(base64Data);
      pdf2table.parse(bufferObj, (response, rows) => resolve(rows));
    });
  }

  getInvoiceFromData(data, list_id, user_id): Invoice {
    // const store = data[0][0].split('  ');
    // const storeName = store[0];
    // const storeCIF = store[1];
    // const storeAddress = data[1];
    const ticketDateArray = data[4][0].split(' ');
    const ticketDate = ticketDateArray[0].split('/');
    const ticketHour = ticketDateArray[1].split(':');
    const date = new Date(
      ticketDate[2],
      ticketDate[1] - 1,
      ticketDate[0],
      ticketHour[0],
      ticketHour[1]
    );
    let total = 0;
    let totalLineNumber = 0;
    let count = 0;

    data.map((elem) => {
      count++;
      if (elem[0] === 'TOTAL (€)') {
        //console.log('elem : ', elem);
        total = elem[1].replace(',', '.') as number;
        totalLineNumber = count;
      }
    });
    const invoice: Invoice = new Invoice(
      this.getInvoiceLines(data, totalLineNumber),
      'EUR',
      total,
      date,
      list_id,
      user_id
    );
    return invoice;
  }

  getInvoiceLines(data, totalLineNumber) {
    const invoiceLine: InvoiceLine[] = [];

    for (let i = 7; i < totalLineNumber - 1; i++) {
      const line = data[i];
      if (line.length <= 4) {
        invoiceLine.push({
          quantity: line[0] as number,
          description: line[1],
          price: line[2].replace(',', '.') as number,
          unitType: UnitType.UNIT
        });
      }
      if (line.length >= 5) {
        const priceArray = line[3].split(' ');
        invoiceLine.push({
          quantity: line[2].replace(',', '.').split(' ')[0] as number,
          description: line[1],
          price: priceArray[0],
          unitType: priceArray[1].split('/')[1]
        });
      }
    }
    return invoiceLine;
  }

  base64ToArrayBuffer(base64File) {
    const binaryString = atob(base64File);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
