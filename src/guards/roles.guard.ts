import { ContextService } from '@context/context.service';
import { ROLES_KEY } from '@decorators/roles.decorator';
import { RoleEnum } from '@enums/role.enum';
import { CommonLogger } from '@logger/common-logger.abstract';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GuardUtil } from '@utils/guard.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private ctx: ContextService,
    private logger: CommonLogger,
  ) {
    logger.setContext(RolesGuard.name);
  }

  async canActivate(context: ExecutionContext) {
    if (this.isPublic(context)) return true;

    const requiredRoles = this.reflector.getAllAndMerge<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const role = this.getUserRole();

    this.logger.info(`Cargo da rota: ${requiredRoles.join(', ')}`);
    this.logger.info('Cargos do usuário:', role);

    const isAuthorized = requiredRoles.includes(role);

    if (!isAuthorized) {
      this.logger.info('Usuário não autorizado!!!');
    }

    return isAuthorized;
  }

  private getUserRole() {
    const { role } = this.ctx.getDataContextThrow('user');
    return role;
  }

  private isPublic(context: ExecutionContext) {
    return GuardUtil.isPublic(this.reflector, context);
  }
}
