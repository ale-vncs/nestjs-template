import { applyDecorators } from '@nestjs/common';
import { ClassType } from '@typings/generic.typing';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { IsDefined, ValidateNested, ValidationOptions } from 'class-validator';

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
        return value
          .map((item: unknown) =>
            typeof item !== 'object' ? JSON.parse(String(item)) : item,
          )
          .map((item: unknown) => plainToInstance(cls, item));
      }),
    );
  }

  return applyDecorators(...decorators);
};
