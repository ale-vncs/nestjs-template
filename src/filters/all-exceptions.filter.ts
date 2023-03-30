import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException
} from '@nestjs/common'
import { ApiErrorException } from '@exceptions/api-error.exception'
import { ResponseApi } from '@utils/result.util'
import { ValidationErrorException } from '@exceptions/validation-error.exception'
import { LoggerAbstract } from '@logger/logger.abstract'
import { Response } from 'express'
import { parseResponse } from '@utils/response.util'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: LoggerAbstract) {
    logger.setContext(AllExceptionsFilter.name)
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    this.logger.error(exception)
    this.logger.error(exception.stack)

    const exceptionList: Record<string, (ex: any) => void> = {
      ApiErrorException: this.apiErrorException,
      NotFoundException: this.notFoundException,
      ValidationErrorException: this.classValidationException
    }

    const execFuncException = exceptionList[exception.name] ?? null

    if (execFuncException) {
      return this.send(response, execFuncException.bind(this)(exception))
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const data = ResponseApi.builder()
      .setStatus(status)
      .setCode('unknownError')
      .body({ path: request.url, message: exception.message })

    return this.send(response, data)
  }

  private apiErrorException(exception: ApiErrorException) {
    this.logger.error(
      `${exception.descriptionCode} - {}`,
      exception.description
    )
    return ResponseApi.builder()
      .setStatus(exception.status)
      .setCode(exception.descriptionCode)
      .body(exception.body)
  }

  private notFoundException(exception: NotFoundException) {
    return ResponseApi.builder()
      .setStatus(HttpStatus.NOT_FOUND)
      .setCode('routeNotFound')
      .body(exception.message)
  }

  private classValidationException(exception: ValidationErrorException) {
    this.logger.error(exception.erros)

    return ResponseApi.builder()
      .setStatus(HttpStatus.BAD_REQUEST)
      .setCode('validationError')
      .body(exception.parse())
  }

  private send(res: Response, data: ResponseApi<unknown>) {
    return res.status(data.status).send(parseResponse(data))
  }
}
