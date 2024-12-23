import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDate, ValidationOptions } from 'class-validator';
import { parseISO } from 'date-fns';

export const IsDateEx = (validationOptions?: ValidationOptions) => {
  return applyDecorators(
    IsDate(validationOptions),
    Transform(({ value }) => parseISO(value)),
  );
};
