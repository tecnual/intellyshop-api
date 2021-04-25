import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ListSchemaProvider } from './list.schema';
import { SavedListSchemaProvider } from './saved-list/saved-list.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      ListSchemaProvider,
      SavedListSchemaProvider
    ])
  ],
  controllers: [ListController],
  providers: [ ListService ],
})
export class ListModule {}
