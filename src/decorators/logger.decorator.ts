import { LoggerAbstract } from '@abstracts/logger.abstract';
import { CommonLogger } from '@logger/common-logger.abstract';
import { ClassType } from '@typings/generic.typing';
import { addClassInConstructor } from '@utils/reflect.util';

type LoggerClassDecorator<C extends LoggerAbstract> = (
  constructor: ClassType<LoggerAbstract>,
) => ClassType<C>;

export const Logger = <C extends LoggerAbstract>(): LoggerClassDecorator<C> => {
  return (constructor) => {
    addClassInConstructor(constructor, CommonLogger);

    const LoggerClass = <ClassType<C>>class extends constructor {
      constructor(logger: CommonLogger, ...args: unknown[]) {
        super(...args);
        this.logger = logger;
        this.logger.setContext(constructor.name);
      }
    };

    Object.defineProperty(LoggerClass, 'name', {
      value: constructor.name,
      writable: false,
    });

    return LoggerClass;
  };
};
