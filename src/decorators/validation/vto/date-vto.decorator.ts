import { applyDecorators } from '@nestjs/common'
import { IsDate, ValidationOptions } from 'class-validator'
import { Transform } from 'class-transformer'
import { parseISO } from 'date-fns'

const DateVto = (validationOptions?: ValidationOptions) => {
  return applyDecorators(
    IsDate(validationOptions),
    Transform(({ value }) => parseISO(value))
  )
}

export default DateVto
