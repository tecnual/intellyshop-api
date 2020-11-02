import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { StatusController } from './status/status.controller';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';

@Module({
  controllers: [StatusController, UserController],
  imports: [UserModule, AuthModule],
  exports: [UserModule, AuthModule]
})
export class CoreModule {}
