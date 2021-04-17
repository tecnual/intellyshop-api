import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { FinanceService } from './finance.service';

@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {

  constructor( private financeService: FinanceService) {}

  @Get('stats')
  /**
   * getStats
   */
  public getStats() {
    return this.financeService.getStats();
  }
}
