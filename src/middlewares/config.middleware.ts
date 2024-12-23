import { ContextService } from '@context/context.service';
import { CommonLogger } from '@logger/common-logger.abstract';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ConfigMiddleware implements NestMiddleware {
  constructor(
    private logger: CommonLogger,
    private ctx: ContextService,
  ) {
    this.logger.setContext(ConfigMiddleware.name);
  }

  private init(req: Request, res: Response) {
    res.locals.timeIni = Date.now();
    const originalUrl = req.originalUrl.replace(/\?.*/, '');
    this.ctx.setDataContext('req', req);
    this.ctx.setPartialDataContext('logger', {
      pathToIgnore: ['/health'],
    });
    res.header(
      'transaction-id',
      this.ctx.getDataContextThrow('logger').transactionId,
    );

    this.logger.info('Iniciando requisição');
    this.logger.info(`[${req.method}] ${originalUrl}`);

    if (Object.keys(req.body).length) {
      this.logger.debug('==== body ====');
      this.logger.debug(JSON.stringify(req.body));
    }

    res.on('finish', () => {
      this.logger.info(
        `Tempo de execução: ${Date.now() - res.locals.timeIni}ms`,
      );
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    return this.ctx.changeContext('api', async () => {
      this.init(req, res);
      return next();
    });
  }
}
