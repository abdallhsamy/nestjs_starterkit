import * as dotenv from 'dotenv';
dotenv.config();

export default {
  jwt_secret: process.env.jwt_secret,
  database_password: process.env.database_password,
  host_database: process.env.host_database,
  database_user: process.env.database_user,
  database: process.env.database,
  port: parseInt(process.env.PORT),
  MQ_URL: process.env.MQ_URL,
  MQ_USER: process.env.MQ_USER,
  MQ_PASS: process.env.MQ_PASS,
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  AWS_S3_KEY_SECRET: process.env.AWS_S3_KEY_SECRET,
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  AWS_URL: process.env.AWS_URL,
  AWS_BASE_URL: process.env.AWS_BASE_URL,
  SERVICE_RETRY_ATTEMPTS: '5s',
  SERVICE_RETRY_DELAY: '1s',
};
