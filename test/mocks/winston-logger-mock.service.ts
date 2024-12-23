import { CommonLogger } from '@logger/common-logger.abstract';

export class WinstonLoggerMockService extends CommonLogger {
  debug(message: unknown, ...optionalParams: unknown[]): void {
    return;
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    return;
  }

  info(message: unknown, ...optionalParam: unknown[]): void {
    return;
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    return;
  }

  setContext(context: string): void {
    return;
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    return;
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    return;
  }
}
