//app.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // upgrade later with STARTTLS
          auth: {
            user: "info@tecnual.com",
            pass: "lbrtlgo10",
          },
        },
        defaults: {
          from: '"Tecnual" <info@tecnual.com>',
        },
        template: {
          dir: join(__dirname, '../../mail/templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
