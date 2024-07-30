// import 'reflect-metadata';
import { DataSource } from 'typeorm';
import appConfiguration from './config';

const {
  DB: { port, name, password, host, user },
} = appConfiguration;

const AppDataSource = new DataSource({
  type: 'postgres',
  host: host,
  port: port,
  username: user,
  password: password,
  database: name,

  entities: [`${__dirname}/**/entities/*.{ts,js}`],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
});

export default AppDataSource;
