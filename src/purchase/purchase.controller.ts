import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { ListItemDto } from 'src/list/dto/add-list.dto';
import { PurchaseService } from './purchase.service';
import { Request } from 'express';
import { User } from 'src/core/user/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('purchase')
export class PurchaseController {
  constructor(
    private readonly purchaseService: PurchaseService
  ) { }

  @Post()
  async addPurchase(@Req() req: Request, @Body() body: ListItemDto[]): Promise<any> {
    return this.purchaseService.add(req.user, body);
  }
}
