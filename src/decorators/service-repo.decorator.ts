import { RepositoryAbstract } from '@abstracts/repository.abstract';
import { ServiceRepoAbstract } from '@abstracts/service-repo.abstract';
import { Service } from '@decorators/service.decorator';
import { ClassType } from '@typings/generic.typing';
import { addClassInConstructor, extendsConstructor } from '@utils/reflect.util';
import { ObjectLiteral } from 'typeorm';

type ServiceRepoClassDecorator<
  R extends RepositoryAbstract<ObjectLiteral>,
  C extends ServiceRepoAbstract<R>,
> = (constructor: ClassType<ServiceRepoAbstract<R>>) => ClassType<C>;

const ServiceRepoDecorator = <
  R extends RepositoryAbstract<ObjectLiteral>,
  C extends ServiceRepoAbstract<R>,
>(
  repository: ClassType<R>,
): ServiceRepoClassDecorator<R, C> => {
  return (constructor) => {
    const newConstructor = extendsConstructor(constructor, Service);
    addClassInConstructor(newConstructor, repository);

    const ServiceRepoClass = <ClassType<C>>class extends newConstructor {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      constructor(repository: R, ...args: any[]) {
        super(...args);
        this.repository = repository;
      }
    };

    Object.defineProperty(ServiceRepoClass, 'name', {
      value: constructor.name,
      writable: false,
    });

    return ServiceRepoClass;
  };
};

export const ServiceRepo = ServiceRepoDecorator;
