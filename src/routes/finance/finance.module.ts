import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedList, SavedListSchema } from 'src/list/saved-list/saved-list.schema';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: SavedList.name, schema: SavedListSchema }]),
    FinanceModule
  ],
  controllers: [FinanceController],
  providers: [FinanceService]
})
export class FinanceModule {}
