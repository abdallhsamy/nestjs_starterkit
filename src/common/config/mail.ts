import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default {
  host: configService.get('MAIL_HOST', 'smtp.mailtrap.io'),

  user: configService.get('MAIL_USER', '1f5130b3ee0325'),

  password: configService.get('MAIL_PASSWORD', '4364fe4f3c6545'),

  mail_from: configService.get('MAIL_FROM') || configService.get('APP_NAME'),

  port: +configService.get('MAIL_PORT') || 2525,

  template_dir: '../../../views',
};
