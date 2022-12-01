import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import config from '../config';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailVerificationMail(user: any, token: string, subject: string, pathname: string) {
    const { name, email } = user;

    const url = `${config('app.url')}${pathname}`;
    
    const html = `<p>Hi ${name},</p>
                  <p>
                    please click here to verify your email
                    <a href="${url}" target="_blank">${token}</a>
                  </p>`;

    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      html: html,
      context: {
        name: user.name,
        url: url,
        token: token,
      }
    });
  }

  async sendForgetPasswordMail(user: any, token: string, subject: string, pathname?: string) {
    const { name, email } = user;

    const url = pathname ? `${config('app.url')}${pathname}` : undefined;
    
    const html = `<p>Hi ${name},</p>` +
                pathname ? 
                `
                  <p>
                    please click here to get forget password form
                    <a href="${url}" target="_blank">${token}</a>
                  </p>
                ` :
                `<p>${token}</p>`;

    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      html: html,
      context: {
        name: user.name,
        url: url,
        token: token,
      }
    });
  }
}
