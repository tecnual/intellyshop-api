import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { Item, ItemDocument } from './item.schema';
import { ItemService } from './item.service';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { OpenFFService } from 'src/shared/openFF/openFF.Service';
import { ListUser } from 'src/list/list.schema';

@UseGuards(JwtAuthGuard)
@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly openFFService: OpenFFService,
  ) {}

  @Post()
  async setItem(@Req() req: Request): Promise<Item> {
    return this.itemService.setItem(req.body);
  }

  @Get()
  async getItems(
    @Query('name') name: string,
    @Query('barcode') barcode: string,
  ): Promise<Item[] | Item> {
    if (barcode) return this.itemService.findOneByBarcode(barcode);
    return this.itemService.findAllByName(name);
  }

  @Patch('/:itemId')
  async patchItem(
    @Req() req: Request,
    @Param('itemId') itemId: string,
  ): Promise<Item> {
    return this.itemService.patchItem(itemId, req.body);
  }

  @Get('/:itemId')
  async getItemById(@Param('itemId') itemId: string): Promise<Item[] | Item> {
    return this.itemService.findOneById(itemId);
  }

  @Get('/:itemId/prices')
  async getItemPrices(
    @Req() req: Request,
    @Param('itemId') itemId: string,
  ): Promise<Item> {
    const item: Item = await this.itemService.findOneById(itemId);
    const user = req.user as ListUser;
    const monthAgo: Date = new Date(
      new Date().setMonth(new Date().getMonth() - 1),
    );
    let result;
    if (
      !item.prices ||
      item.lastPriceUpdateDate.getTime() < monthAgo.getTime()
    ) {
      result = await this.openFFService.getItemPrices(
        item as ItemDocument,
        user,
      );
    }
    return result;
  }
}
