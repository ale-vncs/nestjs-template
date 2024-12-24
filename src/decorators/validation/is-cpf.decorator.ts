import { registerDecorator, ValidationOptions } from 'class-validator'
import { cpf } from 'cpf-cnpj-validator'

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        defaultMessage() {
          return 'must be cpf'
        },
        validate(value: any) {
          if (typeof value === 'string') {
            return cpf.isValid(value)
          }

          return false
        }
      }
    })
  }
}
