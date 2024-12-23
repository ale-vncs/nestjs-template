import { RepositoryAbstract } from '@abstracts/repository.abstract';
import { Repository } from '@decorators/repository.decorator';
import { UserEntity } from '@resources/user/user.entity';

@Repository(UserEntity)
export class UserRepository extends RepositoryAbstract<UserEntity> {
  async getUserByIdentityWithSalesPersonAndVendorPerson(identity: string) {
    const query = this.createQueryBuilder('u')
      .leftJoinAndSelect('u._roles', 'r')
      .leftJoinAndSelect('u.vendorPerson', 'vp')
      .leftJoinAndSelect('u.salesPerson', 'sp')
      .leftJoinAndSelect('sp.unit', 'un')
      .andWhere('u.email = :identity or u.cpfCnpj = :identity', {
        identity,
      });

    return query.getOne();
  }

  async getUserByIdWithSalesPersonAndVendorPerson(userId: string) {
    const query = this.createQueryBuilder('u')
      .leftJoinAndSelect('u._roles', 'r')
      .leftJoinAndSelect('u.vendorPerson', 'vp')
      .leftJoinAndSelect('u.salesPerson', 'sp')
      .leftJoinAndSelect('sp.unit', 'un')
      .andWhere('u.id = :userId', {
        userId,
      });

    return query.getOne();
  }

  async getUserByIdOrFail(userId: string) {
    return this.createQueryBuilder('us')
      .innerJoinAndSelect('us._roles', 'r')
      .andWhere('us.id = :userId', {
        userId,
      })
      .getOneOrFail();
  }
}
