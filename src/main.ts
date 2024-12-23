import { AppConfigType } from '@config/system.config';
import { ApiErrorException } from '@exceptions/api-error.exception';
import { WinstonLoggerService } from '@logger/winston-logger.service';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';

async function bootstrap() {
  initializeTransactionalContext();
  const log = new WinstonLoggerService();
  const app = await NestFactory.create(AppModule, {
    logger: log,
  });
  app.enableCors({
    origin: (origin, callback) => {
      if (origin === undefined) {
        return callback(null, true);
      }
      const cors = (process.env.CORS_URL ?? '').split('|');
      log.debug(`Verificando [${origin}] no cors`);
      if (cors.some((c) => new RegExp(c).test(origin))) {
        return callback(null, true);
      }
      callback(
        new ApiErrorException('UNAUTHORIZED', 'CORS_NOT_ALLOWED'),
        false,
      );
    },
    credentials: true,
  });
  app.enableShutdownHooks();
  const configService =
    app.get<ConfigService<AppConfigType, true>>(ConfigService);
  const port = configService.get('system.port', { infer: true });

  const config = new DocumentBuilder()
    .setTitle('Copasul API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  log.info(`Application port: ${port}`);
}

bootstrap().then();
