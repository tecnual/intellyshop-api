import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { DefaultResponse } from 'src/shared/models/default-response.dto';
import { AddListDto } from '../dto/add-list.dto';
import { ListUser } from '../list.schema';
import { SavedListDocument } from './saved-list.schema';
import { SavedListService } from './saved-list.service';
import { Request } from 'express';
import { GetListsDto } from './get-lists.dto';


@UseGuards(JwtAuthGuard)
@Controller('saved-list')
export class SavedListController {
  constructor(private readonly savedListService: SavedListService) {}

  /**
   * New save list
   * @param body
   * @returns
   */
  @Post()
  async newSavedList(@Body() body: AddListDto): Promise<any> {
    return new DefaultResponse<SavedListDocument>(await this.savedListService.saveList(body));
  }

  /**
   * getStats
   */
  @Get()
  public async getLists(@Req() req: Request, @Query() query?: GetListsDto, @Query('hideFields') hideFields?: string): Promise<DefaultResponse<SavedListDocument[]>> { // TODO: quitar hidefields
    const options = {};
    const filter = {};
    for (const field of query.hideFields) {
      options[field] = 0;
    }
    typeof query.isIncome !== 'undefined' ? filter['income'] = query.isIncome: null;

    const response = new DefaultResponse<SavedListDocument[]>(await this.savedListService.getLists(req.user as ListUser, filter, options));
    return response;
  }
}
