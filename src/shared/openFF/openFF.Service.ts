import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Scope } from '@nestjs/common';
import * as https from 'https';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
@Injectable({ scope: Scope.REQUEST })
export class OpenFFService {
  httpsAgent = new https.Agent({ rejectUnauthorized: false });

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly httpService: HttpService
  ) {}

  async getProductPricesByBarcode(barcode: string): Promise<any> {
    return this.httpService.axiosRef.get('https://prices.openfoodfacts.org/api/v1/prices?product_code=' + barcode, {
      httpsAgent: this.httpsAgent
    });
  }
  async getProductByBarcode(barcode: string): Promise<any> {
    return this.httpService.axiosRef.get('https://prices.openfoodfacts.org/api/v1/products/code/' + barcode, {
      httpsAgent: this.httpsAgent
    }); // Parametrizar en variables la URL
  }

  public async getLastPrice(prices: any[]) {
    const lastPrice = await prices.reduce((a, b) => (new Date(a.date) > new Date(b.date) ? a : b), { date: '1977-08-12' });
    return lastPrice.price;
  }
}
