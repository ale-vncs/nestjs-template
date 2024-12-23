import { RemoveSoftEntityAbstract } from '@abstracts/remove-soft-entity.abstract';
import { EnumColumn } from '@decorators/typeorm/enum-column.decorator';
import { RoleEnum } from '@enums/role.enum';
import { UserPendingIssuesEnum } from '@enums/user-pending-issues.enum';
import { UserStatusEnum } from '@enums/user-status.enum';
import { TypeOrmUtil } from '@utils/typeorm.util';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity('user')
export class UserEntity extends RemoveSoftEntityAbstract {
  @PrimaryColumn({ type: 'varchar' })
  id: string = v4();

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @EnumColumn({
    enumClass: UserStatusEnum,
  })
  status!: UserStatusEnum;

  @Column({ type: 'text' })
  password!: string;

  @Column({
    type: 'text',
    transformer: TypeOrmUtil.transformArrayEnum(UserPendingIssuesEnum),
  })
  pendingIssues!: UserPendingIssuesEnum[];

  @Column({
    type: 'text',
    transformer: TypeOrmUtil.transformArrayEnum(RoleEnum),
  })
  role!: RoleEnum;
}
