import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { AddListDto } from '../dto/add-list.dto';
import { SavedListService } from './saved-list.service';

//@UseGuards(JwtAuthGuard)
@Controller('saved-list')
export class SavedListController {
  constructor(private readonly savedListService: SavedListService) {}

  @Post()
  async newSavedList(@Body() body: AddListDto): Promise<any> {
    return this.savedListService.saveList(body);
  }
}
