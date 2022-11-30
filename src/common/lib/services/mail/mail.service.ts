// import { MailerService } from '@nestjs-modules/mailer';
// import { Injectable } from '@nestjs/common';
// import config from '@src/common/config';

// @Injectable()
// export class MailService {
//   constructor(private mailerService: MailerService) {}

//   async sendUserConfirmation(user: any, token: string) {
//     const url = `${config('app.base_url')}/v1/auth/verify?token=${token}`;

//     await this.mailerService.sendMail({
//       to: user.email,
//       subject: 'Welcome to Nice App! Verify your Email',
//       template: '',
//       context: { name: user.name, url },
//     });
//   }
// }
