import { Controller, Get, Post, Query, Res, HttpStatus, Body, Logger, Put, UseGuards, Req } from '@nestjs/common';
import { MailService } from 'src/providers/mail/mail.service';
import { DefaultResponse } from 'src/shared/models/default-response.dto';
import { ErrorResponse } from 'src/shared/models/error-response.dto';
import { User } from './user.schema';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { AddUserDto } from './dto/add-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserRequest } from './dto/update-user.request.dto';
import { ApiOkResponse, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { UpdateUserResponse } from './dto/update-user.response.dto';
@ApiTags('Users')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) {}

  @ApiResponse({ status: 500, type: ErrorResponse })
  @Post()
  async addUser(@Res() res: Response, @Body() user: AddUserDto): Promise<any> {
    let response: DefaultResponse<User>;
    let status: HttpStatus = HttpStatus.OK;
    try {
      const savedUser: User = await this.userService.add(user);
      savedUser.password = undefined;
      const token: string = this.userService.generateConfirmEmailToken(savedUser.email);
      if (savedUser) this.mailService.sendUserConfirmation(savedUser, token);
      response = new DefaultResponse(savedUser);
      status = HttpStatus.OK;
    } catch (e) {
      this.logger.error(e.errorResponse.errmsg);
      switch (e.code) {
        case 11000: {
          const error: ErrorResponse = {
            code: 'ST004001',
            message: `Este email (${e.keyValue.email}) ya ha sido registrado`
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
  usersList(@Query('filter') filter): Promise<User[]> {
    return this.userService.findAll(filter);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(DefaultResponse) },
        {
          properties: {
            data: { $ref: getSchemaPath(User) },
            errors: {
              type: 'array',
              items: { $ref: getSchemaPath(ErrorResponse) }
            }
          }
        }
      ]
    }
  })
  @UseGuards(JwtAuthGuard)
  @Put('/')
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() user: UpdateUserRequest
  ): Promise<Response<UpdateUserResponse, Record<string, User>>> {
    const reqUser = req.user as User;
    const updatedUser = await this.userService.update(reqUser._id, user);
    const status = HttpStatus.OK;
    const response = new DefaultResponse<User>(updatedUser);
    return res.status(status).send(response);
  }
}
