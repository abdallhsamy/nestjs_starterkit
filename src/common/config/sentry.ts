import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default {
  dsn: configService.get('SENTRY_DSN'),
};
