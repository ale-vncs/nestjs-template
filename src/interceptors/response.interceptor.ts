import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { Response } from 'express'
import { parseResponse } from '@utils/response.util'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> | Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      map((data) => {
        res.status(200).send(parseResponse(data))
      })
    )
  }
}
