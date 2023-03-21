export const systemConfig = () => {
  return {
    port: parseInt(process.env.PORT ?? '3001'),
    dbConfig: {
      host: process.env.POSTGRES_HOST as string,
      port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
      username: process.env.POSTGRES_USERNAME as string,
      password: process.env.POSTGRES_PASSWORD as string,
      database: process.env.POSTGRES_DATABASE as string
    },
    constants: {
      REGEX_UUID:
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      REGEX_DATE_FORMAT: /[0-9]{4}-[0-9]{2}-[0-9]{2}/,
      PASSWORD_MIN_LENGTH: 6,
      NAME_MIN_LENGTH: 3,
      NAME_MAX_LENGTH: 25
    }
  }
}

export type SystemConfig = ReturnType<typeof systemConfig>
