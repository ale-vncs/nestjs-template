import { ServiceAbstract } from '@abstracts/service.abstract';
import { ContextService } from '@context/context.service';
import { Logger } from '@decorators/logger.decorator';
import { SecurityService } from '@integrations/security/security.service';
import { Injectable, ScopeOptions } from '@nestjs/common';
import { ClassType } from '@typings/generic.typing';
import { addClassInConstructor, extendsConstructor } from '@utils/reflect.util';

// @ts-ignore
type ServiceClassDecorator<C extends ServiceAbstract> = (
  constructor: ClassType<ServiceAbstract>,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
) => any;

const ServiceDecorator = <C extends ServiceAbstract>(
  options?: ScopeOptions,
): ServiceClassDecorator<C> => {
  return (constructor) => {
    const newConstructor = extendsConstructor(constructor, Logger);
    Reflect.decorate([Injectable(options)], constructor);
    addClassInConstructor(newConstructor, ContextService, SecurityService);

    const ServiceClass = <ClassType<C>>class extends newConstructor {
      constructor(
        ctx: ContextService,
        securityService: SecurityService,
        ...args: unknown[]
      ) {
        super(...args);
        this.ctx = ctx;
        this.securityService = securityService;
      }
    };

    Object.defineProperty(ServiceClass, 'name', {
      value: constructor.name,
      writable: false,
    });

    return ServiceClass;
  };
};

export const Service = ServiceDecorator;
