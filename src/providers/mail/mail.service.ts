import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/core/user/user.schema';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendUserConfirmation(user: User, token) {
    const baseURL = this.configService.get('corsOrigin');
    const url = baseURL + '/auth/confirm?token=' + token;

    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Bienvenido a IntellyShop! Confirma tu Email',
        template: './confirmation-' + (user.lang || 'es'),
        text: `Bienvenido, por favor confirma tu e-mail: ${url}`,
        context: {
          name: user.name,
          url,
          website: baseURL
        }
      })
      .then()
      .catch((error) => {
        this.logger.error('Email error', error);
      });
  }
}
