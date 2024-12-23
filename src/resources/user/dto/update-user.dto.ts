import { IsTsEnumEx } from '@decorators/validators';
import { UserStatusEnum } from '@enums/user-status.enum';
import { IsOptional } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends CreateUserDTO {
  @IsTsEnumEx(UserStatusEnum)
  @IsOptional()
  status?: UserStatusEnum;
}
