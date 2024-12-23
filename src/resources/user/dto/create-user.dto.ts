import { IsTsEnumEx } from '@decorators/validators';
import { RoleEnum } from '@enums/role.enum';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  password!: string;

  @IsTsEnumEx(RoleEnum)
  role!: RoleEnum;
}
