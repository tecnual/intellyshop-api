
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/shoptonic', {useCreateIndex: true, autoIndex: true, useFindAndModify: false})],
})
export class MongoProviderModule {}
