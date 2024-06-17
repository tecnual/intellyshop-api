import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from 'src/providers/mail/mail.module';
import { MailService } from 'src/providers/mail/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' }
    })
  ],
  providers: [UserService, MailService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
