import { CommonLogger } from '@logger/common-logger.abstract';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { normalizeQuery } from '@utils/query.util';
import { isDate } from 'date-fns';
import { NextFunction, Request, Response } from 'express';
import { isObject } from 'lodash';

@Injectable()
export class QueryParamMiddleware implements NestMiddleware {
  constructor(private logger: CommonLogger) {
    this.logger.setContext(QueryParamMiddleware.name);
  }

  private init(req: Request) {
    if (Object.keys(req.query).length) {
      this.logger.info('==== querys ====');
      req.query = normalizeQuery(req.query as Record<string, string>);
      this.logQuery('', req.query);
      this.logger.info('');
    }
  }

  private logQuery(key: string, value: unknown) {
    const isDateValue = isDate(value);
    if (isObject(value) && !isDateValue) {
      Object.entries(value as Record<string, unknown>).forEach(
        ([skey, value]) => {
          this.logQuery(key ? `${key}.${skey}` : skey, value);
        },
      );
      return;
    }
    let valueParsed = value;
    if (isDateValue) {
      valueParsed = new Date(value as Date).toISOString();
    }
    this.logger.info(`${key}: ${valueParsed}`);
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.init(req);
    return next();
  }
}
