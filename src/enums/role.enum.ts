import { EnumAbstract } from '@abstracts/enum.abstract';
import { Enum } from 'ts-jenum';

@Enum()
export class RoleEnum extends EnumAbstract<RoleEnum> {
  static ADMINISTRATOR = new RoleEnum('Administrador');
  static GUEST = new RoleEnum('Convidado');
}
