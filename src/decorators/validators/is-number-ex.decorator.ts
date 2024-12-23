import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNumber, IsNumberOptions, ValidationOptions } from 'class-validator';

export const IsNumberEx = (
  options?: IsNumberOptions,
  validationOptions?: ValidationOptions | undefined,
) => {
  return applyDecorators(
    IsNumber(options, validationOptions),
    Type(() => Number),
  );
};
