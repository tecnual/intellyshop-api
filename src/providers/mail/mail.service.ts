import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/core/user/user.schema';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendUserConfirmation(user: User, token) {
    const baseURL = this.configService.get('corsOrigin');
    const url = baseURL + '/account/confirm?token=' + token;
    const html = `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width,initial-scale=1">
	    <meta name="x-apple-disable-message-reformatting">
	    <title></title>
      <style>
        table, td, div, h1, p {font-family: Arial, sans-serif; font-size: 16px;}
        .content {
          color: white;
          padding: 15px;
        }
        a.button {
          text-decoration: none;
          background-color: #c2185b;
          padding: 5px 10px;
          border-radius: 4px;
          color: #b5e2f7;
          line-height: 24px;
          margin: 0 auto;
        }
        a.button:visited, a.button:link {
          color: #b5e2f7;
        }
        a.button:hover {
          color: white;
          background-color: #c5215e;
        }
      </style
    <body style="margin:0;padding:0;">
      <table style="width:100%;border-collapse:collapse;border:0;border-spacing:0">
      <tr>
        <td align="center" style="padding:0;">
          <table style="background-color:#303030; min-width: 100px; max-width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left; color: white">
            <tr>
              <td class="content">
                <p>Hola, ${user.name}</p>
                <p>Bienvenido a shoptonic</p>
                <p>Por favor, haz click aquí para confirmar tu correo electrónico</p>
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" style="padding: 0px 10px 60px 10px;">
                <p>
                  <a class="button" style="" href="${url}">Confirmar</a>
                </p>
              </td>
            </tr>
            <tr>
              <td valign="top" style="padding: 0px 10px 60px 10px;">
                <p>Gracias por registrarte con nosotros, esperamos que disfrutes de nuestra applicación.</p>
                <p>Si crees que has recibido este email por error, por favor contactanos en nuestro <a href="${baseURL}">sitio web</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    </body>
    </html>
    `;

    const result = await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <info@tecnual.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      //template: './confirmation-' + (user.lang || 'es'),
      text: 'Bienvenido, ',
      html,
      context: {
        name: user.name,
        url,
        website: baseURL
      }
    });

    console.log('email result ', result);
    //console.log('user ', user);
  }
}
