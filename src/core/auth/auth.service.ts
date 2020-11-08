import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username, pass);
    return user || null;
  }

  async validateUserFromTwitter(email: string): Promise<any> {
    return true;
  }

  async login(user: any) {
    return {
      token: this.jwtService.sign({user}),
      user
    };
  }
}
