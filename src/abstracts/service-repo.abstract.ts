import { RepositoryAbstract } from '@abstracts/repository.abstract';
import { ServiceAbstract } from '@abstracts/service.abstract';
import { ObjectLiteral } from 'typeorm';

export abstract class ServiceRepoAbstract<
  R extends RepositoryAbstract<ObjectLiteral>,
> extends ServiceAbstract {
  protected repository!: R;
}
