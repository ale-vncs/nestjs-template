import { applyDecorators } from '@nestjs/common'
import { IsBoolean, ValidationOptions } from 'class-validator'
import { Type } from 'class-transformer'

const BooleanVto = (validationOptions?: ValidationOptions) => {
  return applyDecorators(
    IsBoolean(validationOptions),
    Type(() => Boolean)
  )
}

export default BooleanVto
