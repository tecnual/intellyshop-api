import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { FireflyIIIService } from './firefly-iii.service';

@ApiTags('Finance Firefly')
@UseGuards(JwtAuthGuard)
@Controller('finance/firefly')
export class FireflyController {
  constructor(private readonly fireflyService: FireflyIIIService) {}
  @Get('accounts')
  async getUserFireflyAccounts(@Req() request: Request | any, @Query('filter') filter: string): Promise<any> {
    const res = await this.fireflyService.getAccounts(request.user, filter);
    return res.data;
  }

  @Get('categories')
  async getUserFireflyCategories(@Req() request: Request | any, @Query('filter') filter: string): Promise<any> {
    const res = await this.fireflyService.getCategories(request.user, filter);
    return res.data;
  }

  @Get('budgets')
  async getUserFireflyBudgets(@Req() request: Request | any, @Query('filter') filter: string): Promise<any> {
    const res = await this.fireflyService.getBudgets(request.user, filter);
    return res.data;
  }

  @Get('tags')
  async getUserFireflyTags(@Req() request: Request | any, @Query('filter') filter: string): Promise<any> {
    const res = await this.fireflyService.getTags(request.user, filter);
    return res.data;
  }
}
