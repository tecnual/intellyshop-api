import { Inject, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { List, ListSchema, ListSchemaProvider } from './list.schema';
import { AuthService } from 'src/core/auth/auth.service';
import { AuthModule } from 'src/core/auth/auth.module';
import { UserModule } from 'src/core/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      ListSchemaProvider
    ])
  ],
  controllers: [ListController],
  providers: [ ListService ],
})
export class ListModule {}
