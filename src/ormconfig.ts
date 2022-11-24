import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();

export let ormOptions   :any = {
  type: 'mysql',
  host: configService.get('DATABASE_HOST'),
  port: configService.get('DATABASE_PORT', 3306),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [ __dirname + '/**/entities/*.entity{.ts,.js}'],
  synchronize: configService.get('DATABASE_SYNCHRONIZE', false),
  logging: configService.get('LOG_DATABASE_QUERIES', false)
}
const source = new DataSource(ormOptions);
export default source;
