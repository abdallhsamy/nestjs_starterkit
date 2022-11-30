// import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { Module } from '@nestjs/common';
// import { MailService } from './mail.service';
// import { join } from 'path';
// import config from '@src/common/config';

// @Module({
//   imports: [
//     MailerModule.forRoot({
//       transport: {
//         host: config('mail.host'),
//         secure: false,
//         auth: {
//           user: config('mail.user'),
//           pass: config('mail.password'),
//         },
//       },
//       defaults: {
//         from: `"No Reply" <${config('mail.mail_from')}>`,
//       },
//       template: {
//         dir: join(__dirname, 'templates'),
//         adapter: new HandlebarsAdapter(),
//         options: { strict: true },
//       },
//     }),
//   ],
//   providers: [MailService],
//   exports: [MailService],
// })
// export class MailModule {}
