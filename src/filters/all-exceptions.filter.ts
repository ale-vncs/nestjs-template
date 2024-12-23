import { Constants } from '@config/system.config';
import { ApiErrorException } from '@exceptions/api-error.exception';
import { ValidationErrorException } from '@exceptions/validation-error.exception';
import { CommonLogger } from '@logger/common-logger.abstract';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { parseResponseError } from '@utils/response.util';
import { ResponseApi } from '@utils/result.util';
import { Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: CommonLogger) {
    logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const exceptionList: Record<string, (ex: any) => ResponseApi<unknown>> = {
      ApiErrorException: this.apiErrorException,
      UnprocessableEntityException: this.apiErrorException,
      InternalServerErrorException: this.apiErrorException,
      BadRequestException: this.apiErrorException,
      NotFoundException: this.notFoundException,
      ValidationErrorException: this.classValidationException,
      EntityNotFoundError: this.entityNotFoundError,
      ForbiddenException: this.forbiddenException,
      UnauthorizedException: this.unauthorizedException,
    };

    const execFuncException = exceptionList[exception.name] ?? null;

    if (exception.name) {
      this.logger.error(exception.stack);
    } else {
      this.logger.error(exception);
    }

    if (execFuncException) {
      return this.send(response, execFuncException.bind(this)(exception));
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const data = ResponseApi.builder()
      .status(status)
      .code('UNKNOWN_ERROR')
      .error(exception.message);

    return this.send(response, data);
  }

  private apiErrorException(exception: ApiErrorException) {
    return ResponseApi.builder()
      .status(exception.status)
      .code(exception.errCode)
      .error(exception.details);
  }

  private notFoundException(exception: NotFoundException) {
    return ResponseApi.builder()
      .status(HttpStatus.NOT_FOUND)
      .code('ROUTE_NOT_FOUND')
      .error(exception.message);
  }

  private classValidationException(exception: ValidationErrorException) {
    this.logger.error(JSON.stringify(exception.parse(), null, 2));

    return ResponseApi.builder()
      .status(HttpStatus.BAD_REQUEST)
      .code('VALIDATION_ERROR')
      .error(exception.parse());
  }

  private entityNotFoundError(exception: EntityNotFoundError) {
    return ResponseApi.builder()
      .status(HttpStatus.NOT_FOUND)
      .code('ENTITY_NOT_FOUND');
  }

  private forbiddenException(exception: ForbiddenException) {
    return ResponseApi.builder()
      .status(HttpStatus.FORBIDDEN)
      .code('NOT_AUTHORIZED')
      .error(exception.message);
  }

  private unauthorizedException(exception: ForbiddenException) {
    return ResponseApi.builder()
      .status(HttpStatus.UNAUTHORIZED)
      .code('NOT_AUTHORIZED')
      .error(exception.message);
  }

  private send(res: Response, data: ResponseApi<unknown>) {
    if (data._status === HttpStatus.UNAUTHORIZED) {
      res.clearCookie(Constants.ACCESS_TOKEN_KEY_NAME);
    }
    return res.status(data._status).json(parseResponseError(data));
  }
}
