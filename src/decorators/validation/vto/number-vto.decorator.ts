import { IsNumber, IsNumberOptions, ValidationOptions } from 'class-validator'
import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'

const NumberVto = (
  options?: IsNumberOptions,
  validationOptions?: ValidationOptions | undefined
) => {
  return applyDecorators(
    IsNumber(options, validationOptions),
    Type(() => Number)
  )
}

export default NumberVto
