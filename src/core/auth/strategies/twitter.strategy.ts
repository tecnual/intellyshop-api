// import { AuthService } from '../auth.service';
// import { PassportStrategy} from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { TwitterConfig } from '../../config/twitter.config';
// import { ConfigService } from '../../config/config.service';
// import { Strategy } from 'passport-twitter';

// @Injectable()
// export class TwitterStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private readonly authService: AuthService
//   ) {
//       super(TwitterConfig);
//   }
//   async validate(token, tokenSecret, profile) {
//     console.log('validate');
//     console.log({token, tokenSecret, profile});
//     const user = await this.authService.validateUserFromTwitter(profile.email);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
