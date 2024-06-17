import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  HttpStatus,
  Body
} from '@nestjs/common';
import { MailService } from 'src/providers/mail/mail.service';
import { DefaultResponse } from 'src/shared/models/default-response';
import { ErrorResponse } from 'src/shared/models/error-response.interface';
import { User } from './user.schema';
import { UserService } from './user.service';
import { Response } from 'express';
import { AddUserDto } from './dto/add-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) {}

  @Post()
  async addUser(@Res() res: Response, @Body() user: AddUserDto): Promise<any> {
    let response: DefaultResponse<User>;
    let status: HttpStatus = HttpStatus.OK;
    //const savedUser: User = { name: 'Test', email: 'pedro@tecnual.com', username: 'Prueba', confirmed: false}
    try {
      const savedUser: User = await this.userService.add(user);
      savedUser.password = undefined;
      const token: string = this.userService.generateConfirmEmailToken(
        savedUser.email
      );
      if (savedUser) this.mailService.sendUserConfirmation(savedUser, token);
      response = new DefaultResponse(savedUser);
      status = HttpStatus.OK;
    } catch (e) {
      switch (e.code) {
        case 11000: {
          const error: ErrorResponse = {
            code: 'ST004001',
            message: `This email (${e.keyValue.email}) has already been registered`
          };
          response = new DefaultResponse(null, [error]);
          status = HttpStatus.CONFLICT;
          break;
        }
        default: {
          const error: ErrorResponse = {
            code: 'ST005000',
            message: 'Unknown Error'
          };
          response = new DefaultResponse(null, [error]);
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
        }
      }
    } finally {
      return res.status(status).send(response);
    }
  }

  @Get()
  usersList(@Query('filter') filter) {
    return this.userService.findAll(filter);
  }
}
