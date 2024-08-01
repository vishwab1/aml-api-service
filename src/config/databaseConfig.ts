import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import appConfiguration from './config';

const {
  DB: { port, name, password, host, user },
} = appConfiguration;

const AppDataSource = new Sequelize({
  dialect: 'postgres',
  host: host,
  port: port,
  username: user,
  password: password,
  database: name,
  models: [__dirname + '/**/*.model.ts'],
});

export default AppDataSource;
