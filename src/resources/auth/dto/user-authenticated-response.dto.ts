import { UserEntity } from '@resources/user/user.entity';

export class UserAuthenticatedResponseDto {
  name!: string;
  email!: string;
  role!: string;

  static fromUserEntity(userEntity: UserEntity) {
    const dto = new UserAuthenticatedResponseDto();

    dto.name = userEntity.name;
    dto.email = userEntity.email;
    dto.role = userEntity.role.name;

    return dto;
  }
}
