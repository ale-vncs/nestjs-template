import * as path from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { appConfig } from '../../config/system.config';

export const dataSourceOptions = (databaseName?: string): DataSourceOptions => {
  const { host, port, database, password, username } = appConfig().database;
  const migrationPath = path.join(__dirname, 'seed');

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database: databaseName || database,
    migrationsTableName: '_typeorm_seed',
    migrations: [`${migrationPath}/*.{j,t}s`],
    logging: process.env.LOGGER_ORM === 'true',
  };
};

export default new DataSource(dataSourceOptions());
