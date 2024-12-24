import { IsEnum, ValidationOptions } from 'class-validator'

const EnumVto = (en: object, validationOptions?: ValidationOptions) => {
  return IsEnum(en, validationOptions)
}

export default EnumVto
