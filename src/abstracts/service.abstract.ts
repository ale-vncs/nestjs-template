import { LoggerAbstract } from '@abstracts/logger.abstract';
import { ContextService } from '@context/context.service';
import { SecurityService } from '@integrations/security/security.service';

export abstract class ServiceAbstract extends LoggerAbstract {
  protected ctx!: ContextService;
  protected securityService!: SecurityService;

  protected getUserAuthenticated() {
    return this.securityService.getUserAuthenticated();
  }
}
