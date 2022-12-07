import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default {
  name: configService.get('APP_NAME', 'nestjs_starter_kit'),

  url: configService.get('APP_URL', 'http://localhost'),

  port: configService.get('APP_PORT', 80),

  host: configService.get('APP_HOST'),

  global_prefix: '',

  secret_key: configService.get('SECRET_KEY', 'secretKey'),

  enable_swagger: configService.get('ENABLE_SWAGGER', false),

  token_expire: configService.get('TOKEN_EXPIRE', false),
};
