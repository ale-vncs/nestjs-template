import { applyDecorators } from '@nestjs/common';
import { ClassType } from '@typings/generic.typing';
import { Transform } from 'class-transformer';
import { ValidationOptions, registerDecorator } from 'class-validator';
import { IStaticEnum } from 'ts-jenum';

const tsEnumValidator = (
  enumClass: ClassType<unknown>,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (target, propertyKey) => {
    return registerDecorator({
      name: 'isTsEnum',
      target: target.constructor,
      propertyName: propertyKey as string,
      constraints: [],
      options: validationOptions,
      validator: {
        defaultMessage() {
          //return `must be enum of ${enumClass.name}: ${(enumClass as IStaticEnum<unknown>).values()}`;
          return `must be enum of ${enumClass.name}`;
        },
        validate(value: unknown) {
          return (enumClass as IStaticEnum<unknown>).values().includes(value);
        },
      },
    });
  };
};

const parseEnumOrNull = (enumClass: unknown, value: unknown) => {
  try {
    return (enumClass as IStaticEnum<unknown>).valueByName(<string>value);
  } catch (e) {
    return null;
  }
};

export const IsTsEnumEx = (
  enumClass: ClassType<unknown>,
  validationOptions?: ValidationOptions,
) => {
  return applyDecorators(
    tsEnumValidator(enumClass, validationOptions),
    Transform(({ value }) => {
      if (validationOptions?.each)
        return value.map((item: unknown) => parseEnumOrNull(enumClass, item));
      return parseEnumOrNull(enumClass, value);
    }),
  );
};
