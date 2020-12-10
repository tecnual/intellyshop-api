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
    async addItem(@Req() req: Request): Promise<Item> {
        console.log('--', req.body);
        return this.itemService.add(req.body);
    }

    @Get()
    async getItems(@Query('name') name: string, @Query('barcode') barcode: string): Promise<Item[] | Item> {
        if (barcode) return this.itemService.findOneByBarcode(barcode);
        return this.itemService.findAllByName(name);
    }

    @Patch('/:itemId')
    async patchItem(@Req() req: Request, @Param('itemId') itemId: string,): Promise<Item> {
        console.log(req.body);
        return this.itemService.patchItem(itemId, req.body);
    }

}
