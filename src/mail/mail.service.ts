import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from "@src/user/entities/user.entity";
import config from "@config/index";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserEntity, token: string) {
    const url = config('app.url') + `/v1/auth/verify-email?token=${token}`

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to '+config('app.name')+'! Confirm your Email',
      template: './email_verification.mail.hbs', // `.hbs` extension is appended automatically
      context: {
        name: user.name,
        url : url,
        token : token
      }
    });
  }

  async sendForgetPasswordMail(user: UserEntity, token: string) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to ' + config('app.name') + '! Confirm your Email',
      template: './reset_password.mail.hbs', // `.hbs` extension is appended automatically
      context: {
        name: user.name,
        url: config('app.url') + '/v1/auth/verify-email',
        token: token,
      },
    });
  }
}
