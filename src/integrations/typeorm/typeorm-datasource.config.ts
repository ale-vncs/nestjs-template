import * as path from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { appConfig } from '../../config/system.config';

export const dataSourceOptions = (databaseName?: string): DataSourceOptions => {
  const { host, port, database, password, username } = appConfig().database;
  const migrationPath = path.join(__dirname, 'migrations');

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database: databaseName || database,
    migrationsTableName: '_typeorm_migrations',
    migrations: [`${migrationPath}/*.{j,t}s`], //migration,
    logging: process.env.LOGGER_ORM === 'true',
    maxQueryExecutionTime: 100,
  };
};

export default new DataSource(dataSourceOptions());
