import { RepositoryAbstract } from '@abstracts/repository.abstract';
import { Repository } from '@decorators/repository.decorator';
import { UserEntity } from '@resources/user/user.entity';

@Repository(UserEntity)
export class UserRepository extends RepositoryAbstract<UserEntity> {
  async getUserByIdentity(identity: string) {
    const query = this.createQueryBuilder('u').andWhere('u.email = :identity', {
      identity,
    });

    return query.getOne();
  }

  async getUserById(userId: string) {
    const query = this.createQueryBuilder('u').andWhere('u.id = :userId', {
      userId,
    });

    return query.getOne();
  }

  async getUserByIdOrFail(userId: string) {
    return this.createQueryBuilder('us')
      .andWhere('us.id = :userId', {
        userId,
      })
      .getOneOrFail();
  }
}
