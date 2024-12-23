import { RepositoryAbstract } from '@abstracts/repository.abstract';
import { Injectable } from '@nestjs/common';
import { ClassType } from '@typings/generic.typing';
import { addClassInConstructor } from '@utils/reflect.util';
import { DataSource } from 'typeorm';

type RepositoryClassDecorator<
  E extends object,
  R extends RepositoryAbstract<E>,
> = (constructor: ClassType<RepositoryAbstract<E>>) => ClassType<R>;

const RepositoryDecorator = <E extends object, R extends RepositoryAbstract<E>>(
  entity: ClassType<E>,
): RepositoryClassDecorator<E, R> => {
  return (constructor) => {
    Reflect.decorate([Injectable()], constructor);
    addClassInConstructor(constructor, DataSource);

    const RepositoryClass = <ClassType<R>>class extends constructor {
      constructor(dataSource: DataSource) {
        super(entity, dataSource.createEntityManager());
      }
    };
    Object.defineProperty(RepositoryClass, 'name', {
      value: constructor.name,
      writable: false,
    });

    return RepositoryClass;
  };
};

export const Repository = RepositoryDecorator;
