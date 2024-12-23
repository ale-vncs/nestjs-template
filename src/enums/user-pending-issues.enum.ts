import { EnumAbstract } from '@abstracts/enum.abstract';
import { Enum } from 'ts-jenum';

@Enum()
export class UserPendingIssuesEnum extends EnumAbstract<UserPendingIssuesEnum> {
  static TEMPORARY_PASSWORD = new UserPendingIssuesEnum(
    'Necessário alterar senha',
  );
}
