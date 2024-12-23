import { Provider, ValidationPipe } from '@nestjs/common';

import { TestContextService } from '@config/test-context.service';
import { ValidationErrorException } from '@exceptions/validation-error.exception';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { ResponseInterceptor } from '../interceptors/response.interceptor';

export const providerGlobal: Provider[] = [
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new ValidationErrorException(errors),
    }),
  },
  {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },
  {
    provide: APP_GUARD,
    useExisting: JwtAuthGuard,
  },
  {
    provide: APP_GUARD,
    useExisting: RolesGuard,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },
  JwtAuthGuard,
  RolesGuard,
];

if (process.env.NODE_ENV === 'test') {
  providerGlobal.push(TestContextService);
}
