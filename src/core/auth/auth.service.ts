import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  user;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    this.user = await this.userService.findOne(username, pass);
    if (!this.user?.confirmed) return null;
    return this.user || null;
  }

  async validateUserFromTwitter(email: string): Promise<any> {
    return true;
  }

  /**
   * Login
   * @param user
   * @returns
   */
  async login(user: any) {
    return {
      token: this.jwtService.sign({ user }),
      user
    };
  }

  /**
   * Confirm email by token
   * @param token
   * @returns
   */
  public async confirmEmail(token: string) {
    return this.jwtService.decode(token, { json: true });
  }
}
