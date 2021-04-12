import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { DefaultResponse } from 'src/shared/models/default-response.interface';
import { AddListDto } from '../dto/add-list.dto';
import { SavedListDocument } from './saved-list.schema';
import { SavedListService } from './saved-list.service';

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
  public async getLists(@Query('hideFields') hideFields: string): Promise<DefaultResponse<SavedListDocument[]>> {
    const options = {};
    if (hideFields) {
      hideFields.includes('images') ? options['images'] = 0: null;
      hideFields.includes('cartItems') ? options['cartItems'] =  0: null;
      hideFields.includes('listItems') ? options['listItems'] = 0: null;
    }

    const response = new DefaultResponse<SavedListDocument[]>(await this.savedListService.getLists(options));
    return response;
  }
}
