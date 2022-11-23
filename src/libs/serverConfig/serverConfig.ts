import * as dotenv from "dotenv";
dotenv.config();

export default {
  // jwt_secret: process.env.jwt_secret || 'IwillAddSomeRandomSomeCharactersHere',
  database_password: process.env.database_password || 'password',
  host_database: process.env.host_database || 'localhost',
  database_user: process.env.database_user || 'root',
  database: process.env.database || 'insurance',
  port: parseInt(process.env.PORT) || 13000,
  MQ_URL: process.env.MQ_URL || '172.16.40.24',
  MQ_USER: process.env.MQ_USER || 'guest',
  MQ_PASS: process.env.MQ_PASS || 'guest',
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY || 'AKIA3WX4SQHWBCZQFO4D',
  AWS_S3_KEY_SECRET: process.env.AWS_S3_KEY_SECRET || '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',
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION || 'eu-central-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'dafa-apps-test',
  AWS_URL: process.env.AWS_URL || 'https://dafa-apps-test.s3.eu-central-1.amazonaws.com/public/',
  AWS_BASE_URL: process.env.AWS_BASE_URL || 'https://dafa-apps-test.s3.eu-central-1.amazonaws.com',
  ECOMMERCE_IP: process.env.ECOMMERCE_IP || '172.16.40.40',
  ECOMMERCE_PORT: +process.env.ECOMMERCE_PORT || 18001,
  JOCKEY_IP: process.env.JOCKEY_IP || '172.16.40.40',
  JOCKEY_PORT: +process.env.JOCKEY_PORT || 16001,
  SSO_NAME: process.env.SSO_NAME || 'SSO_SERVICE',
  SSO_IP: process.env.SSO_IP || '172.16.40.24',
  SSO_PORT: +process.env.SSO_PORT || 15001,
  SERVICE_RETRY_ATTEMPTS: +process.env.SERVICE_RETRY_ATTEMPTS || 0,
  SERVICE_RETRY_DELAY: +process.env.SERVICE_RETRY_DELAY || 0,
};
