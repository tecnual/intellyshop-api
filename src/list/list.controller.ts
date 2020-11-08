import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { AddListDto } from './dto/add-list.dto';
import { List } from './list.schema';
import { ListService } from './list.service';
//import { Request } from '@nestjs/common';
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

    @Put(':listId/item/')
    addItemToList(@Param('listId') listId: string, @Req() req): Observable<any> { // TODO: cambiar Req por body
        return this.listService.addItemToList(listId, req.body);
    }
}
