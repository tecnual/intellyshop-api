import { Request } from 'express';
import { Controller, Get, Post, Req, UseGuards, Query, Patch, Param, Body, Res, Put, Logger } from '@nestjs/common';
import { Item } from './item.schema';
import { ItemService } from './item.service';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { OpenFFService } from 'src/shared/openFF/openFF.Service';
import { ListUser } from 'src/list/list.schema';
import { Price } from './price.schema';
import { DefaultResponse } from 'src/shared/models/default-response';
@UseGuards(JwtAuthGuard)
@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly openFFService: OpenFFService,
    private readonly logger: Logger
  ) {}

  @Post()
  async setItem(@Req() req, @Body() body: any): Promise<Item> {
    return this.itemService.setItem(body, req.user._id);
  }

  @Get()
  async getItems(@Query('name') name: string, @Query('barcode') barcode: string): Promise<Item[] | Item> {
    if (barcode) {
      return this.itemService.findOneByBarcode(barcode);
    } else {
      return this.itemService.findAllByName(name);
    }
  }

  @Patch('/:itemId')
  async patchItem(@Req() req: Request, @Param('itemId') itemId: string): Promise<Item> {
    return this.itemService.patchItem(itemId, req.body);
  }

  @Put('/:itemId/prices')
  async putItemPrice(@Req() req: Request, @Param('itemId') itemId: string): Promise<Item> {
    // const item = await this.itemService.findOneById(itemId);
    // const user = req.user as User;
    // const price = new Price(req.body.price, user._id, Source.USER, 'EUR', new Date());
    // const prices = this.itemService.addPricesToItemPrices([price], item.prices);
    // item.prices = prices;
    return this.itemService.addPriceToItem(itemId, req.body);
  }

  @Get('/:itemId')
  async getItemById(@Res() res, @Param('itemId') itemId: string): Promise<Item[] | Item> {
    this.logger.verbose(itemId, 'ItemId');
    const item = await this.itemService.findOneById(itemId);
    if (item) {
      return res.status(200).send(new DefaultResponse<Item>(item));
    } else {
      return res.status(404).send(new DefaultResponse<Item>(null, [{ code: 'IS0002404', message: 'Producto no encontrado' }]));
    }
  }

  @Get('/:itemId/prices')
  async getItemPrices(@Req() req: Request, @Param('itemId') itemId: string): Promise<Price[]> {
    this.logger.verbose(itemId, 'itemId');
    let item: Item = await this.itemService.findOneById(itemId);
    const user = req.user as ListUser;
    const monthAgo: Date = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let result;
    if (!item.prices || item.lastPriceUpdateDate.getTime() < monthAgo.getTime()) {
      result = await this.openFFService.getProductPricesByBarcode(item.barcode);
      let prices;
      if (result.data.total > 0) {
        prices = await this.itemService.mapPricesFromOpenFF(result.data.items, user._id, item.prices);
        item = await this.itemService.setPricesToItem(itemId, prices);
      }
    }
    return item.prices;
  }
}
