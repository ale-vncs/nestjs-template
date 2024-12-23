import { IS_PUBLIC_KEY } from '@decorators/public.decorator';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export class GuardUtil {
  static isPublic(reflector: Reflector, context: ExecutionContext) {
    return reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
