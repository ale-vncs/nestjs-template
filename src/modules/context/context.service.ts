import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SystemConfig } from '@config/system.config'
import { ContextUtil } from '@modules/context/context.util'
import { Undefined } from '@typings/generic.typing'
import { AppContextType, ContextKeys } from '@typings/context.typings'
import { ApiErrorException } from '@exceptions/api-error.exception'

@Injectable()
export class ContextService {
  private contextUtil = ContextUtil.getInstance()

  constructor(private configService: ConfigService) {}

  getConfig<T extends keyof SystemConfig>(key: T) {
    return this.configService.get<SystemConfig[T]>(key)
  }

  getDataContext<K extends keyof ContextKeys>(
    key: K
  ): Undefined<ContextKeys[K]> {
    return this.contextUtil.getContext(key)
  }

  getDataContextThrow<K extends keyof ContextKeys>(key: K): ContextKeys[K] {
    const data = this.contextUtil.getContext(key)

    if (!data) {
      throw new ApiErrorException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'contextDataUndefined'
      )
    }

    return data
  }

  setDataContext<K extends keyof ContextKeys>(key: K, data: ContextKeys[K]) {
    this.contextUtil.setContext(key, data)
  }

  changeContext(context: AppContextType, cb: () => void) {
    this.contextUtil.changeContext(context, cb)
  }
}
