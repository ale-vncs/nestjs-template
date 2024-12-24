import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsBoolean, ValidationOptions } from 'class-validator';

export const IsBooleanEx = (validationOptions?: ValidationOptions) => {
  return applyDecorators(
    IsBoolean(validationOptions),
    Type(() => Boolean),
  );
};
