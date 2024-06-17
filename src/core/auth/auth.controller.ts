import { Controller, Request, UseGuards, Post, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { ErrorResponse } from 'src/shared/models/error-response.interface';
import { DefaultResponse } from 'src/shared/models/default-response';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
    ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginLocal(@Request() req) {
     return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  /**
   * Confirm email
   * @param token
   * @returns
   */
  @Get('confirm')
  async confirmEmail(@Res() res: Response, @Query('token') token: string) {
    const confirmation = await this.authService.confirmEmail(token)
    let updatedUser;
    if (confirmation) updatedUser = await this.userService.updateConfirm({email: confirmation['email']});
    if (confirmation && updatedUser.confirmed) {
      return res.status(HttpStatus.OK).send(new DefaultResponse({confirmed: true}));
    } else {
      const error: ErrorResponse = { code: 'ST005000', message:'Unknown Error'};
      const response = new DefaultResponse(null, [error]);
      return res.status(HttpStatus.BAD_REQUEST).send(response);
    }
  }
}
