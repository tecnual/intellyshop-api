import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { AddListDto } from './dto/add-list.dto';
import { List, ListUser } from './list.schema';
import { ListService } from './list.service';
import { Request } from 'express';
import { DefaultResponse } from 'src/shared/models/default-response.interface';
import { ModifyListRequest } from 'src/model/rest/modify-list.request';
import { ErrorResponse } from 'src/shared/models/error-response.interface';

@UseGuards(JwtAuthGuard)
@Controller('list')
export class ListController {
    constructor(private readonly listService: ListService) {}

    @Post()
    async upsertList(@Req() req: Request, @Body() body: AddListDto): Promise<any> {
        return this.listService.upsert(body, req.user);
    }

    @Get()
    async getUserLists(@Req() req: Request): Promise<List[]> {
        return this.listService.getUserLists(req.user);
    }

    /**
     * Delete List
     * @param listId List Identifier
     * @returns db result
     */
    @Delete('/:listId')
    deleteList(@Param('listId') listId: string) {
      return this.listService.deleteList(listId);
    }

    /**
     * modifyList
     */
     @Patch('/:listId')
     public modifyList(@Body() body: ModifyListRequest): DefaultResponse<any> { // TODO: poner el tipo correcto

      if (body.saved) {
        console.log('duplicate list');
      }
      return new DefaultResponse<string>('ok');
    }

    @Patch('/:listId/item/') // TODO: pasar el itemId en los parametros de la url
    addItemToList(@Param('listId') listId: string, @Req() req): Observable<any> { // TODO: cambiar Req por body
        return this.listService.addItemToList(listId, req.body);
    }

    @Patch('/:listId/cart/item/') // TODO: pasar el itemId en los parametros de la url
    addItemToListCart(@Param('listId') listId: string, @Req() req): Observable<any> { // TODO: cambiar Req por body
        return this.listService.addItemToListCart(listId, req.body);
    }

    @Delete('/:listId/item/:listItemId')
    removeItemFromList(@Param('listId') listId: string, @Param('listItemId') listItemId: string) {
        return this.listService.removeItemFromList(listId, listItemId);
    }

    @Delete('/:listId/list')
    removeListItems(@Param('listId') listId: string) {
        return this.listService.removeListItems(listId);
    }

    @Delete('/:listId/cart')
    removeCartItems(@Param('listId') listId: string) {
        return this.listService.removeCartItems(listId);
    }

    @Delete('/:listId/cart/item/:cartItemId')
    removeItemFromCartList(@Param('listId') listId: string, @Param('cartItemId') cartItemId: string) {
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

    @Put('/:listId/share-user') // TODO: pasar el itemId en los parametros de la url
    addSharedUser(@Param('listId') listId: string, @Body() user: any): Observable<ListUser> { // TODO: cambiar Req por body
      return this.listService.addSharedUser(listId, user);
    }

    /**
     * addImageTolist
     */
    @Post('/:listId/image')
    public async addImageTolist(@Param('listId') listId: string,@Body() body: any): Promise<DefaultResponse<any>> {
      try {
        if (true) {}
        const data = await this.listService.addImageToList(listId, body.image);
        console.log('data', data);
        return new DefaultResponse<List>(data);
      } catch (e) {
        console.log('Error', e);
        return new DefaultResponse<ErrorResponse>(e);
      }
      return null;
    }
}
