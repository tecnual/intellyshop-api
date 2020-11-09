import { Request } from 'express';
import { Controller, Get, Post, Req, UseGuards, Query} from '@nestjs/common';
import { Item } from './item.schema';
import { ItemService } from './item.service';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('item')
export class ItemController {

    constructor(private readonly itemService: ItemService) {}

    @Post()
    async addItem(@Req() req: Request): Promise<Item> {
        return this.itemService.add({name: req.body.name, description: req.body.description});
    }

    @Get()
    async getItems(@Query('filter') filter: string): Promise<Item[]> {
        console.log('filter', filter);
        return this.itemService.findAll(filter);
    }
}
