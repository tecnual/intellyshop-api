import { Request } from 'express';
import { Controller, Get, Post, Req, UseGuards, Query, Patch, Param} from '@nestjs/common';
import { Item } from './item.schema';
import { ItemService } from './item.service';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('item')
export class ItemController {

    constructor(private readonly itemService: ItemService) {}

    @Post()
    async setItem(@Req() req: Request): Promise<Item> {
        return this.itemService.setItem(req.body);
    }

    @Get()
    async getItems(@Query('name') name: string, @Query('barcode') barcode: string): Promise<Item[] | Item> {
        if (barcode) return this.itemService.findOneByBarcode(barcode);
        return this.itemService.findAllByName(name);
    }

    @Patch('/:itemId')
    async patchItem(@Req() req: Request, @Param('itemId') itemId: string): Promise<Item> {
        return this.itemService.patchItem(itemId, req.body);
    }

    @Get('/:itemId')
    async getItemById(@Param('itemId') itemId: string): Promise<Item[] | Item> {
        return this.itemService.findOneById(itemId);
    }

}
