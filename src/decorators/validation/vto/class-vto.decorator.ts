import { applyDecorators } from '@nestjs/common'
import { IsDefined, ValidateNested, ValidationOptions } from 'class-validator'
import { plainToInstance, Transform, Type } from 'class-transformer'

const ClassVto = (
  cls: new () => void,
  validationOptions?: ValidationOptions
) => {
  const decorators: PropertyDecorator[] = [
    IsDefined(validationOptions),
    ValidateNested(validationOptions),
    Type(() => cls)
  ]

  if (validationOptions?.each) {
    decorators.push(
      Transform(({ value }) => {
        return value
          .map((item: any) =>
            typeof item !== 'object' ? JSON.parse(item) : item
          )
          .map((item: any) => plainToInstance(cls, item))
      })
    )
  }

  return applyDecorators(...decorators)
}

export default ClassVto
