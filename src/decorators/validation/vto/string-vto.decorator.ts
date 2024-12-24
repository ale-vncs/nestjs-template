import { applyDecorators } from '@nestjs/common'
import { IsString, ValidationOptions } from 'class-validator'
import { Type } from 'class-transformer'

const StringVto = (validationOptions?: ValidationOptions) => {
  return applyDecorators(
    IsString(validationOptions),
    Type(() => String)
  )
}

export default StringVto
