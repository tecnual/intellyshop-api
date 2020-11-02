import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { from, Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { AddListDto } from './dto/add-list.dto';
import { List } from './list.schema';
import { ListService } from './list.service';

@UseGuards(JwtAuthGuard)
@Controller('list')
export class ListController {
    constructor(private readonly listService: ListService) {}

    @Post()
    async addList(@Body() body: AddListDto): Promise<List> {        
        return this.listService.add(body);
    }

    @Get()
    async getLists(): Promise<List[]> {
        return this.listService.findAll();
    }

    @Put(':listId/item/')
    addItemToList(@Param('listId') listId: string, @Req() req: Request): Observable<any> { // TODO: cambiar Req por body
        return this.listService.addItemToList(listId, req.body);
    }
}
