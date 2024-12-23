import { ContextService } from '@context/context.service';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GuardUtil } from '@utils/guard.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    protected reflector: Reflector,
    protected ctx: ContextService,
  ) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    if (this.isPublic(context)) return true;

    return super.canActivate(context);
  }

  protected isPublic(context: ExecutionContext) {
    return GuardUtil.isPublic(this.reflector, context);
  }
}
