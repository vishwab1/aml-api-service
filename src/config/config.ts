import Joi, { Schema } from 'joi';
import dotenv from 'dotenv';
import { get, isEqual, map } from 'lodash';
import path from 'path';
import { IConfiguration, IValidate } from './interfaces';

// Load environment variables from .env file
const envFilePath = path.join(__dirname, '../../.env');

// Load the environment variables
dotenv.config({ path: envFilePath });

// Check if environment variables are loaded

// Define the schema for the environment variables
const envVarsSchema: Schema = Joi.object({
  LOG_FILE_DAY: Joi.string().description('Log file day'),
  LOG_FILE_ENABLE: Joi.string().description('Log file enable'),
  LOG_FILE_NAME: Joi.string().description('Log file name'),
  LOG_FILE_SIZE: Joi.string().description('Log file size'),
  LOG_FILE_ZIP_ARCHIVE: Joi.string().description('Log file zip archive'),
  APPLICATION_ENV: Joi.string().valid('production', 'development', 'test').required().description('Application environment'),
  APPLICATION_PORT: Joi.number().default(4000),
  APP_VERSION: Joi.string().description('app verion is required'),
  DB_HOST: Joi.string().description('Database host'),
  DB_PORT: Joi.number().description('Database port'),
  DB_PASS: Joi.string().description('Database Password'),
  DB_USER: Joi.string().description('Database User'),
  DB_NAME: Joi.string().description('Database Name'),
}).unknown(true); // Allow unknown keys

const { value: envVars, error } = envVarsSchema.validate(process.env, {
  errors: { label: 'key' },
}) as IValidate;

// Throw an error if validation fails
if (error) {
  const errorMessage = map(get(error, 'details'), 'message').join(', ');

  throw new Error(`Config validation error: ${errorMessage}`);
}

// Check if validated environment variables are loaded correctly

const appConfiguration: IConfiguration = {
  log: {
    day: get(envVars, 'LOG_FILE_DAY', '14d'),
    isEnable: isEqual(get(envVars, 'LOG_FILE_ENABLE', 'true'), 'true'),
    name: get(envVars, 'LOG_FILE_NAME', 'AML-log'),
    size: get(envVars, 'LOG_FILE_SIZE', '20m'),
    zippedArchive: isEqual(get(envVars, 'LOG_FILE_ZIP_ARCHIVE', 'false'), 'true'),
  },
  ENV_PORT: get(envVars, 'APPLICATION_PORT', 4000),
  applicationEnv: get(envVars, 'APPLICATION_ENV'),
  appVersion: get(envVars, 'APP_VERSION'),
  DB: {
    host: get(envVars, 'DB_HOST'),
    port: get(envVars, 'DB_PORT'),
    password: get(envVars, 'DB_PASS'),
    name: get(envVars, 'DB_NAME'),
    user: get(envVars, 'DB_USER'),
  },
};

export default appConfiguration;
