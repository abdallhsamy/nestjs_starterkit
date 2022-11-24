import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default {
  db_type: configService.get('DATABASE_TYPE', 'mysql'),

  db_name: configService.get('DATABASE_NAME', 'nestjs_starter_kit'),

  db_port: parseInt(configService.get('DATABASE_PORT', '3306')),

  db_host: configService.get('DATABASE_HOST', 'localhost'),

  db_username: configService.get('DATABASE_USERNAME', 'root'),

  db_password: configService.get('DATABASE_PASSWORD', 'password'),

  sync: configService.get('DATABASE_SYNCHRONIZE', false),

  ENABLE_SWAGGER: configService.get('ENABLE_SWAGGER', false),

  loq_queries: configService.get('LOG_DATABASE_QUERIES', false),
};
