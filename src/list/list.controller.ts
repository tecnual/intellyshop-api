import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { AddListDto } from './dto/add-list.dto';
import { List } from './list.schema';
import { ListService } from './list.service';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('list')
export class ListController {
    constructor(private readonly listService: ListService) {}

    @Post()
    async addList(@Req() req: Request, @Body() body: AddListDto): Promise<List> {
        return this.listService.add(body, req.user);
    }

    @Get()
    async getUserLists(@Req() req: Request): Promise<List[]> {
        return this.listService.getUserLists(req.user);
    }

    @Patch('/:listId/item/') // TODO: pasar el itemId el los parametros de la url
    addItemToList(@Param('listId') listId: string, @Req() req): Observable<any> { // TODO: cambiar Req por body
        return this.listService.addItemToList(listId, req.body);
    }

    @Patch('/:listId/cart/item/') // TODO: pasar el itemId el los parametros de la url
    addItemToListCart(@Param('listId') listId: string, @Req() req): Observable<any> { // TODO: cambiar Req por body
        return this.listService.addItemToListCart(listId, req.body);
    }

    @Delete('/:listId/item/:listItemId')
    removeItemFromList(@Param('listId') listId: string, @Param('listItemId') listItemId: string) {
        return this.listService.removeItemFromList(listId, listItemId);
    }

    @Delete('/:listId/list')
    removeListItems(@Param('listId') listId: string) {
        console.log('removeListItems', listId);
        return this.listService.removeListItems(listId);
    }

    @Delete('/:listId/cart')
    removeCartItems(@Param('listId') listId: string) {
        console.log('removeCartItems', listId);
        return this.listService.removeCartItems(listId);
    }

    @Delete('/:listId/cart/item/:cartItemId')
    removeItemFromCartList(@Param('listId') listId: string, @Param('cartItemId') cartItemId: string) {
        console.log('removeItemFromListCart', listId, cartItemId);
        return this.listService.removeItemFromListCart(listId, cartItemId);
    }

    @Put('/:listId/list/item/:listItemId')
    updateListItem(@Param('listId') listId: string, @Param('listItemId') listItemId: string, @Body() body: any) {
      return this.listService.updateItemFromList(listId, listItemId, body, 'list');
    }

    @Put('/:listId/cart/item/:listItemId')
    updateCartItem(@Param('listId') listId: string, @Param('listItemId') listItemId: string, @Body() body: any) {
      return this.listService.updateItemFromList(listId, listItemId, body, 'cart');
    }
}
