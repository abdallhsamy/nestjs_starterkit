// import dotenv from 'dotenv';
// dotenv.config();

import app from './app';
import database from './database';
import mail from './mail';
import sentry from './sentry';

const allowedConfigModules = {
  app: app,
  database: database,
  mail: mail,
  sentry: sentry,
};

function config(key: string, default_value?: string | null) {
  const array = key.split('.');

  if (array.length != 2) {
    throw new Error('Invalid config key: ' + key);
  }

  const file_name = array[0];
  const file_key = array[1];

  if (
    !allowedConfigModules[file_name] ||
    !allowedConfigModules[file_name][file_key]
  ) {
    return default_value;
  }

  return allowedConfigModules[file_name][file_key];
}
export default config;
