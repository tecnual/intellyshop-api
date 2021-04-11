import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedListController } from './saved-list.controller';
import { SavedList, SavedListSchema } from './saved-list.schema';
import { SavedListService } from './saved-list.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: SavedList.name, schema: SavedListSchema }]), SavedListModule],
  controllers: [SavedListController],
  providers: [SavedListService],
})
export class SavedListModule {}
