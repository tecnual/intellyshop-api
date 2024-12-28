import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedList, SavedListSchema } from 'src/list/saved-list/saved-list.schema';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { FireflyController } from './infrastructure/firefly-iii/firefly.controller';
import { FireflyIIIService } from './infrastructure/firefly-iii/firefly-iii.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SavedList.name, schema: SavedListSchema }]),
    FinanceModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5
      })
    })
  ],
  controllers: [FinanceController, FireflyController],
  providers: [FinanceService, FireflyIIIService]
})
export class FinanceModule {}
