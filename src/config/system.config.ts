import { Undefined } from '@typings/generic.typing';

const getEnv = <T = string>(key: string, defaultValue = ''): T => {
  const value = process.env[key];
  if (value) return String(value) as T;
  return defaultValue as T;
};

export const Constants = {
  ACCESS_TOKEN_KEY_NAME: 'access_token',
};

export const appConfig = () => {
  return {
    system: {
      env: getEnv('APP_ENVIRONMENT', 'development'),
      port: Number(getEnv('PORT', '3030')),
    },
    database: {
      host: getEnv('DATABASE_HOST'),
      port: Number.parseInt(getEnv('DATABASE_PORT', '5432')),
      database: getEnv('DATABASE_NAME', 'copasul'),
      password: getEnv('DATABASE_PASSWORD'),
      username: getEnv('DATABASE_USER'),
    },
    redis: {
      host: getEnv('REDIS_HOST', 'localhost'),
      port: Number.parseInt(getEnv('REDIS_PORT', '6379')),
      password: getEnv<Undefined<string>>('REDIS_PASSWORD', undefined),
    },
    security: {
      cryptoSecret: getEnv(
        'CRYPTO_SECRET',
        '324f0c21-df82-472f-b084-a40906f30bc6',
      ),
      bcryptSalt: Number.parseInt(getEnv('BCRYPT_SALT', '8')),
      jwtSecret: getEnv('JWT_SECRET', '7208d54c-b6ed-493a-8bc5-4b66150e520d'),
      jwtTTLInMinutes: Number(getEnv('ACCESS_TOKEN_TTL_IN_MINUTES', '240')),
      renovateInMinutes: Number(getEnv('JWT_RENOVATE_IN_MINUTES', '5')),
    },
  };
};

export type AppConfigType = ReturnType<typeof appConfig>;
