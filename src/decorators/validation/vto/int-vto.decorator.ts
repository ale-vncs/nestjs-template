import { applyDecorators } from '@nestjs/common'
import { IsInt, ValidationOptions } from 'class-validator'
import { Transform } from 'class-transformer'

const IntVto = (validationOptions?: ValidationOptions) => {
  return applyDecorators(
    IsInt(validationOptions),
    Transform(({ value }) => (value ? parseInt(String(value)) : value))
  )
}

export default IntVto
