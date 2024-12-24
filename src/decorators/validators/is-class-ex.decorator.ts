import { applyDecorators } from '@nestjs/common';
import { ClassType } from '@typings/generic.typing';
import {
  Transform,
  Type,
  instanceToInstance,
  plainToInstance,
} from 'class-transformer';
import { IsDefined, ValidateNested, ValidationOptions } from 'class-validator';
import { isObject } from 'lodash';

export const IsClassEx = (
  cls: ClassType<unknown>,
  validationOptions?: ValidationOptions,
) => {
  const decorators: PropertyDecorator[] = [
    IsDefined(validationOptions),
    ValidateNested(validationOptions),
    Type(() => cls),
  ];

  if (validationOptions?.each) {
    decorators.push(
      Transform(({ value }) => {
        return value.map((item: unknown) =>
          isObject(item)
            ? instanceToInstance(cls, item)
            : plainToInstance(cls, item),
        );
      }),
    );
  }

  return applyDecorators(...decorators);
};
