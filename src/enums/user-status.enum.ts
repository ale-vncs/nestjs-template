import { EnumAbstract } from '@abstracts/enum.abstract';
import { Enum } from 'ts-jenum';

@Enum()
export class UserStatusEnum extends EnumAbstract<UserStatusEnum> {
  static ACTIVE = new UserStatusEnum('Ativo');
  static INACTIVE = new UserStatusEnum('Inativo');
}
