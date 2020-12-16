import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TwitterAuthGuard extends AuthGuard('twitter') {
  private roles;
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.roles = this.reflector.get<string[]>('roles', context.getHandler());
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException(info);
    }
    if (this.roles) {
      if (user.roles && this.hasRole(user)) {
        return user;
      } else {
        throw new UnauthorizedException('Forbidden');
      }
    }
    return user;
  }
  private hasRole(user): boolean {
    return user.roles.some(role => !!this.roles.find(item => item === role));
  }
}
