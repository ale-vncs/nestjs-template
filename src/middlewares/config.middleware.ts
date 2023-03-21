import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { differenceInMilliseconds } from 'date-fns'
import { LoggerAbstract } from '@logger/logger.abstract'
import { ContextService } from '@context/context.service'

@Injectable()
export class ConfigMiddleware implements NestMiddleware {
  constructor(private logger: LoggerAbstract, private ctx: ContextService) {
    this.logger.setContext(ConfigMiddleware.name)
  }

  private init(req: Request, res: Response) {
    res.locals.timeIni = new Date().getTime()
    this.ctx.setDataContext('req', {
      originalUrl: req.originalUrl.replace(/\?.*/, ''),
      method: req.method,
      host: `${req.protocol}://${req.get('host')}`
    })

    res.on('finish', () => {
      this.logger.info(
        `Tempo de execução: ${differenceInMilliseconds(
          new Date(),
          res.locals.timeIni
        )} ms`
      )
    })

    this.logger.info('Iniciando requisição')

    if (Object.keys(req.query).length) {
      this.logger.info('==== querys ====')
      Object.entries(req.query).forEach(([key, value]) => {
        this.logger.info(`${key}: ${value}`)
      })
      this.logger.info('')
    }

    if (Object.keys(req.body).length) {
      this.logger.debug('==== body ====')
      this.logger.debug(req.body)
    }
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.ctx.changeContext('api', () => {
      this.init(req, res)
      next()
    })
  }
}
