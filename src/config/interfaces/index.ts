import { ValidationError } from 'joi';

// Define the IValidate interface for validation results
export interface IValidate {
  value: IEnvVars;
  error: ValidationError;
}

// Define the IEnvVars interface
export interface IEnvVars {
  LOG_FILE_DAY?: string;
  LOG_FILE_ENABLE?: string;
  LOG_FILE_NAME?: string;
  LOG_FILE_SIZE?: string;
  LOG_FILE_ZIP_ARCHIVE?: string;
  APPLICATION_ENV: string;
  APPLICATION_PORT: number;
  APP_VERSION: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_PASS: string;
  DB_USER: string;
  DB_NAME: string;
}

// Define the IConfiguration interface
export interface IConfiguration {
  log: {
    day: string;
    isEnable: boolean;
    name: string;
    size: string;
    zippedArchive: boolean;
  };
  ENV_PORT: number;
  applicationEnv: string;
  appVersion: string;
  DB: {
    port: number;
    host: string;
    password: string;
    user: string;
    name: string;
  };
}
