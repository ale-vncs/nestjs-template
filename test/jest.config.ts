import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import type { Config } from 'jest';

dotenv.config({
  path: '.env.test',
});

const getModuleNameMapper = () => {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  const tsConfig = fs.readFileSync(tsConfigPath, { encoding: 'utf8' });

  const paths = JSON.parse(tsConfig).compilerOptions.paths as Record<
    string,
    [string]
  >;

  const moduleNameMapper: Record<string, string> = {};

  const keyParse = (key: string) => {
    return key.replace('/*', '(.*)');
  };

  const valueParse = (value: string) => {
    return value.replace('/*', '$1');
  };

  Object.entries(paths).forEach(([key, [value]]) => {
    const keyModule = `^${keyParse(key)}$`;
    moduleNameMapper[keyModule] = `<rootDir>/${valueParse(value)}`;
  });

  return moduleNameMapper;
};

const config: Config = {
  silent: process.env.LOGGER_TEST === 'false',
  workerIdleMemoryLimit: '512MB',
  randomize: true,
  moduleNameMapper: getModuleNameMapper(),
  modulePaths: ['src'],
  roots: ['<rootDir>/test/specs'],
  rootDir: process.cwd(),
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+.ts$': [
      'ts-jest',
      {
        isolatedModules: true,
        diagnostics: false,
      },
    ],
  },
  verbose: true,
  logHeapUsage: true,
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 70,
      lines: 85,
      statements: 85,
    },
  },
  coverageDirectory: path.join(process.cwd(), 'coverage'),
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/main.ts',
    '!src/abstracts/**',
    '!src/config/**',
    '!src/enums/**',
    '!src/decorators/**',
    '!src/exceptions/**',
    '!src/typings/**',
    '!src/logger/**',
    '!src/scheduler/**',
    '!src/**/*.module.ts',
    '!src/**/*.guard.ts',
    '!src/**/*.filter.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.interceptor.ts',
  ],
  testEnvironment: 'node',
  detectOpenHandles: false,
};

export default config;
