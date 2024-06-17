import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ItemDocument } from 'src/item/item.schema';
import { ItemService } from 'src/item/item.service';
import { Source } from 'src/item/price.schema';
import { ListUser } from 'src/list/list.schema';

@Injectable()
export class OpenFFService {
  constructor(
    private readonly httpService: HttpService,
    private readonly itemService: ItemService
  ) {}

  async getItemPrices(item: ItemDocument, user: ListUser): Promise<any> {
    const result = await this.httpService.axiosRef.get(
      'https://prices.openfoodfacts.org/api/v1/prices?product_code=' +
        item.barcode
    );
    let prices;
    if (result.data.total > 0) {
      prices = await this.itemService.setPrices(
        result.data.items,
        item._id,
        user,
        Source.OPEN_FOOD_FACTS
      );
    }
    return prices;
  }
}
