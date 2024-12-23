import { LoggerAbstract } from '@abstracts/logger.abstract';
import { AppConfigType } from '@config/system.config';
import { Logger } from '@decorators/logger.decorator';
import { ApiErrorException } from '@exceptions/api-error.exception';
import { ContextUtil } from '@integrations/context/context.util';
import { ConfigService } from '@nestjs/config';
import { AppContextType, ContextKeys } from '@typings/context.typings';
import { Undefined } from '@typings/generic.typing';
import { Request } from 'express';

@Logger()
export class ContextService extends LoggerAbstract {
  private contextUtil = ContextUtil.getInstance();

  constructor(private configService: ConfigService<AppConfigType, true>) {
    super();
  }

  getConfig<T extends keyof AppConfigType>(key: T): AppConfigType[T] {
    return this.configService.get(key, { infer: true });
  }

  getDataContext<K extends keyof ContextKeys>(
    key: K,
  ): Undefined<ContextKeys[K]> {
    return this.contextUtil.getContext(key);
  }

  getDataContextThrow<K extends keyof ContextKeys>(key: K): ContextKeys[K] {
    const data = this.contextUtil.getContext(key);

    if (!data) {
      this.logger.error(`Não foi possível pegar valor da chave: [${key}]`);
      throw new ApiErrorException(
        'INTERNAL_SERVER_ERROR',
        'CONTEXT_DATA_UNDEFINED',
      );
    }

    return data;
  }

  setDataContext<K extends keyof ContextKeys>(key: K, data: ContextKeys[K]) {
    this.contextUtil.setContext(key, data);
  }

  setPartialDataContext<K extends keyof ContextKeys>(
    key: K,
    data: Partial<ContextKeys[K]>,
  ) {
    const newData = { ...this.contextUtil.getContext(key), ...data };
    this.contextUtil.setContext(key, newData);
  }

  changeContext<T>(context: AppContextType, cb: () => Promise<T>) {
    return this.contextUtil.changeContext(context, cb);
  }

  getRequestContext(): Request {
    return this.getDataContextThrow('req');
  }
}
