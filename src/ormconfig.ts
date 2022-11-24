import { DataSource } from 'typeorm';
import config from './config';

export let ormOptions   :any = {
  type: 'mysql',
  host: config('database.db_host'),
  port: config('database.db_port'),
  username: config('database.db_username'),
  password: config('database.db_password'),
  database: config('database.db_name'),
  entities: [ __dirname + '/**/entities/*.entity{.ts,.js}'],
  synchronize: config('database.sync'),
  logging: config('database.loq_queries')
}
const source = new DataSource(ormOptions);
export default source;
