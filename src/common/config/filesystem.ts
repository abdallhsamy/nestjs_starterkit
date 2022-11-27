import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default {
  driver: configService.get('FILE_SYSTEM_DRIVER', 'local'),
};
