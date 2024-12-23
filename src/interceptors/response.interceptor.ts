import { Constants } from '@config/system.config';
import { ContextService } from '@context/context.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { NullOrUndefined } from '@typings/generic.typing';
import { ResponseApi } from '@utils/result.util';
import { CookieOptions, Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private ctx: ContextService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const res = context.switchToHttp().getResponse<Response>();
    const accessTokenKey = Constants.ACCESS_TOKEN_KEY_NAME;

    return next.handle().pipe(
      map((data) => {
        const cookie = this.ctx.getDataContext('cookie');
        this.setCookieOrClear(res, accessTokenKey, cookie?.accessToken);

        if (data instanceof ResponseApi) {
          res.status(data._status);
          return data._body;
        }
        return data;
      }),
    );
  }

  private setCookieOrClear(
    res: Response,
    key: string,
    value: NullOrUndefined<string>,
  ) {
    const cookieOption: CookieOptions = {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };
    if (value) {
      res.cookie(key, value, cookieOption);
    } else {
      res.clearCookie(key);
    }
  }
}
