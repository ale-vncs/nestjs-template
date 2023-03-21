import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WinstonLoggerService } from '@logger/winston-logger.service'
import { ConfigService } from '@nestjs/config'
import { SystemConfig } from '@config/system.config'
import { ValidationPipe } from '@nestjs/common'
import { ValidationErrorException } from '@exceptions/validation-error.exception'

async function bootstrap() {
  const log = new WinstonLoggerService()
  const app = await NestFactory.create(AppModule, {
    logger: log
  })

  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new ValidationErrorException(errors)
    })
  )

  const configService =
    app.get<ConfigService<SystemConfig, true>>(ConfigService)
  const port = configService.get('port', { infer: true })

  await app.listen(port)
  log.info(`Application is running on port: ${port}`)
}
bootstrap().then()
