import { EntityAbstract } from '@abstracts/entity.abstract';
import { Null } from '@typings/generic.typing';
import { DeleteDateColumn } from 'typeorm';

export abstract class RemoveSoftEntityAbstract extends EntityAbstract {
  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt: Null<Date> = null;
}
