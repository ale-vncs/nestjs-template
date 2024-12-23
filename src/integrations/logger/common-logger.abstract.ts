import { LoggerService } from '@nestjs/common';

export abstract class CommonLogger implements LoggerService {
  abstract debug(message: unknown, ...optionalParams: unknown[]): void;

  abstract error(message: unknown, ...optionalParams: unknown[]): void;

  abstract log(message: unknown, ...optionalParams: unknown[]): void;

  abstract verbose(message: unknown, ...optionalParams: unknown[]): void;

  abstract warn(message: unknown, ...optionalParams: unknown[]): void;

  abstract info(message: unknown, ...optionalParam: unknown[]): void;

  abstract setContext(context: string): void;

  protected buildWithOptionalParam(
    message: unknown,
    ...optionalParam: unknown[]
  ) {
    return optionalParam.reduce<string>(
      (prev, curr) => `${prev} ${curr}`,
      String(message),
    );
  }
}
