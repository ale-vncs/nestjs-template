import * as fs from 'node:fs';
import * as path from 'node:path';
import { AppModule } from '@appModule';
import { TestContextService } from '@config/test-context.service';
import {
  TypeOrmConfigService,
  typeOrmModuleOptions,
} from '@config/typeorm-module.config';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { CacheConfigService } from '@integrations/cache/cache-config.service';
import { dataSourceOptions } from '@integrations/typeorm/typeorm-datasource.config';
import { CommonLogger } from '@logger/common-logger.abstract';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfigMockService } from '@test/mocks/cache-config-mock.service';
import { JwtAuthMockGuard } from '@test/mocks/jwt-auth-mock.guard';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { v4 } from 'uuid';
import { WinstonLoggerMockService } from '../mocks/winston-logger-mock.service';
import { MockUserFn, UserMockBuilder } from './user-mock-builder';

export const testingE2eUtil = () => {
  let nestApp: INestApplication;
  let api: TestAgent;
  let moduleFixture: TestingModule;

  const dbId = v4().slice(0, 8);
  const database = `db-test-${dbId}`;
  const dataSourceOption = dataSourceOptions(database);
  const postgresConnection = new DataSource(dataSourceOptions('postgres'));
  const showLogger = process.env.LOGGER_TEST === 'true';

  beforeAll(async () => {
    initializeTransactionalContext();
    await createUniqueDatabase();
    const testingModule = Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeOrmConfigService)
      .useValue({
        createTypeOrmOptions: () => typeOrmModuleOptions(dataSourceOption),
      })
      .overrideProvider(JwtAuthGuard)
      .useClass(JwtAuthMockGuard)
      .overrideProvider(CacheConfigService)
      .useClass(CacheConfigMockService);
    if (!showLogger) {
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      testingModule
        .overrideProvider(CommonLogger)
        .useClass(WinstonLoggerMockService);
    }

    moduleFixture = await testingModule.compile();

    nestApp = moduleFixture.createNestApplication();
    nestApp.enableShutdownHooks();

    await nestApp.init();
  }, 15000);

  beforeEach(async () => {
    const dataSource = getDataSource();
    await dataSource.dropDatabase();
    await dataSource.runMigrations();
    await execScript('init-database.sql');
    getModule(TestContextService).resetTestContext();
    api = request(nestApp.getHttpServer());
  }, 15000);

  afterEach(async () => {
    getModule(TestContextService).resetTestContext();
  });

  afterAll(async () => {
    await getDataSource().destroy();
    await dropDataBase();
    await nestApp.close();
  }, 15000);

  const getModule = <T>(obj: new (...args: never[]) => T) => {
    return moduleFixture.get<T>(obj);
  };

  const getDataSource = () => {
    return getModule(DataSource);
  };

  const createUniqueDatabase = async () => {
    const conn = await postgresConnection.initialize();
    await conn.query(`create database "${database}"`);
    await conn.destroy();
  };

  const dropDataBase = async () => {
    const conn = await postgresConnection.initialize();
    await conn.query(`drop database "${database}"`);
    await conn.destroy();
  };

  const getScriptFile = (filename: string) => {
    const filePath = path.join(process.cwd(), 'test', 'scripts', filename);
    return fs.readFileSync(filePath, { encoding: 'utf8' });
  };

  const execScript = async (filename: string) => {
    await getDataSource().query(getScriptFile(filename));
  };

  const getFileTest = (filename: string) => {
    return path.resolve(process.cwd(), 'test', 'files', filename);
  };

  const mockUserAuthenticated = (user?: MockUserFn) => {
    const testContext = getModule(TestContextService);
    const userMock = UserMockBuilder.builder();
    userMock.autoLogin(true);
    user?.(userMock);
    const userAuthenticated = userMock.getUser();

    testContext.setUserMockBuilder(userMock);

    return userAuthenticated;
  };

  return {
    itUtil: () => ({
      getModule,
      api,
      mockUserAuthenticated,
      execScript,
      getFileTest,
    }),
  };
};
