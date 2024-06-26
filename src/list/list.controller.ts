import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { AddListDto, ListFile } from './dto/add-list.dto';
import { List, ListDocument, ListUser } from './list.schema';
import { ListService } from './list.service';
import { Request, Response } from 'express';
import { DefaultResponse } from 'src/shared/models/default-response';
import { ModifyListRequest } from 'src/model/rest/modify-list.request';
import { ErrorResponse } from 'src/shared/models/error-response.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('List')
@UseGuards(JwtAuthGuard)
@Controller('list')
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly logger: Logger
  ) {}

  /**
   * Update a new list or generate a new one
   * @param req
   * @param body
   * @returns
   */
  @Post()
  async upsertList(@Res() res: any, @Req() req: Request, @Body() body: AddListDto): Promise<any> {
    let response;
    let status;
    const user = req.user as ListUser;
    if (!body.owner || (body.owner && user._id === body.owner._id)) {
      const result = await this.listService.upsert(body, req.user as ListUser);
      response = new DefaultResponse<any>(result);
      status = HttpStatus.OK;
    } else {
      response = new DefaultResponse<any>(null, [
        {
          code: 'STE00403',
          message: 'No permitido: No está autorizado a modificar esta lista'
        }
      ]);
      status = HttpStatus.FORBIDDEN;
    }
    return res.status(status).send(response);
  }

  /**
   * Get users lists
   * @param req
   * @returns
   */
  @Get()
  async getUserLists(@Req() req: Request): Promise<any[]> {
    this.logger.verbose(req.user, 'getUserLists User');
    return this.listService.getUserLists(req.user as ListUser);
  }

  /**
   * Delete List
   * @param listId List Identifier
   * @returns db result
   */
  @Delete('/:listId')
  deleteList(@Param('listId') listId: string, @Req() req: Request) {
    return this.listService.deleteList(listId, req.user as ListUser);
  }

  /**
   * modifyList
   * @param listId List id
   * @param body Modify list request
   */
  @Patch('/:listId')
  public async modifyList(@Param('listId') listId: string, @Body() body: ModifyListRequest): Promise<DefaultResponse<any>> {
    // TODO: poner el tipo correcto
    const listModified = await this.listService.modifyList(listId, body);
    if (body.saved) {
      const newList = new AddListDto();
      newList.name = listModified.name;
      newList.owner = listModified.owner;
      newList.sharedUsers = listModified.sharedUsers;
      newList.store = listModified.store;
      newList.description = listModified.description;
      return new DefaultResponse<any>({
        listModified,
        newList: await this.listService.upsert(newList, listModified.owner)
      });
    }
  }

  /**
   * Add item to items list
   * @param listId
   * @param req
   * @returns
   */
  @Patch('/:listId/item/')
  addItemToList(@Param('listId') listId: string, @Req() req: Request): Observable<any> {
    // TODO: cambiar Req por body
    return this.listService.addItemToItemsList(listId, req.body, req.user as ListUser);
  }

  @Patch('/:listId/cart-item/') // TODO: pasar el itemId en los parametros de la url
  addItemToCartList(@Param('listId') listId: string, @Req() req: Request): Observable<any> {
    // TODO: cambiar Req por body
    return this.listService.addItemToListCart(listId, req.body, req.user as ListUser);
  }

  @Delete('/:listId/item/:listItemId')
  removeItemFromList(@Param('listId') listId: string, @Param('listItemId') listItemId: string, @Req() req: Request) {
    return this.listService.removeItemFromList(listId, listItemId, req.user as ListUser);
  }

  @Delete('/:listId/list')
  removeListItems(@Param('listId') listId: string, @Req() req: Request) {
    return this.listService.removeListItems(listId, req.user as ListUser);
  }

  @Delete('/:listId/cart')
  removeCartItems(@Param('listId') listId: string, @Req() req: Request) {
    return this.listService.removeCartItems(listId, req.user as ListUser);
  }

  @Delete('/:listId/cart-item/:cartItemId')
  removeItemFromCartList(@Param('listId') listId: string, @Param('cartItemId') cartItemId: string, @Req() req: Request) {
    return this.listService.removeItemFromCartList(listId, cartItemId, req.user as ListUser);
  }

  @Put('/:listId/list-item/:listItemId')
  updateListItem(@Param('listId') listId: string, @Param('listItemId') listItemId: string, @Body() body: any, @Req() req: Request) {
    return this.listService.updateItemFromList(listId, listItemId, body, 'list', req.user as ListUser);
  }

  @Put('/:listId/cart-item/:listItemId')
  updateCartItem(@Param('listId') listId: string, @Param('listItemId') listItemId: string, @Body() body: any, @Req() req: Request) {
    return this.listService.updateItemFromList(listId, listItemId, body, 'cart', req.user as ListUser);
  }

  /**
   * Add Shared User
   * @param listId
   * @param sharedUser
   * @param req
   */
  @Put('/:listId/share-user') // TODO: pasar el itemId en los parametros de la url
  addSharedUser(@Param('listId') listId: string, @Body() sharedUser: any, @Req() req: Request): Observable<ListUser> {
    // TODO: cambiar Req por body
    return this.listService.addSharedUser(listId, sharedUser, req.user as ListUser);
  }

  /**
   * addImageTolist
   */
  @Post('/:listId/image')
  public async addImageTolist(@Param('listId') listId: string, @Body() body: any, @Req() req: Request): Promise<DefaultResponse<any>> {
    const data = await this.listService.addImageToList(listId, body.image, req.user as ListUser);
    return new DefaultResponse<List>(data);
  }

  /**
   * deleteAllImages
   */
  @Delete('/:listId/image')
  public async deleteAllImages(@Param('listId') listId: string) {
    const data = await this.listService.deleteAllImagesFromList(listId);
    return new DefaultResponse<List>(data);
  }

  /**
   * Add files to list
   */
  @Post('/:listId/file')
  public async addFileTolist(@Param('listId') listId: string, @Body() body: ListFile, @Req() req: Request, @Res() res: Response) {
    this.logger.verbose(body.invoice_id, 'InvoiceId');
    const user = req.user as ListUser;
    const file = await this.listService.addInvoiceFromFile(listId, body, user._id);
    if (!file) {
      return res
        .status(HttpStatus.CONFLICT)
        .send(new DefaultResponse<ErrorResponse>(null, [{ code: 'IS0001409', message: 'La factura ya existe en nuestra base de datos' }]));
    } else {
      const data: ListDocument = await this.listService.addFileToList(listId, file as ListFile, req.user as ListUser);
      return res.status(HttpStatus.OK).send(new DefaultResponse<List>(data));
    }
  }
}
