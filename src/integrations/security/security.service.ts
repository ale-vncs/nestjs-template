import { ContextService } from '@context/context.service';
import { CommonLogger } from '@logger/common-logger.abstract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityService {
  constructor(
    private logger: CommonLogger,
    private ctx: ContextService,
  ) {
    logger.setContext(SecurityService.name);
  }

  public getUserAuthenticated() {
    this.logger.info('Recebendo usuário autenticado');
    return this.ctx.getDataContextThrow('user');
  }
}
