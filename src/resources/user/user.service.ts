import { ServiceRepoAbstract } from '@abstracts/service-repo.abstract';
import { ServiceRepo } from '@decorators/service-repo.decorator';
import { RoleEnum } from '@enums/role.enum';
import { UserPendingIssuesEnum } from '@enums/user-pending-issues.enum';
import { ApiErrorException } from '@exceptions/api-error.exception';
import { UnprocessableEntityException } from '@exceptions/unprocessable-entity.exception';
import { TemporaryPasswordCacheService } from '@integrations/cache/temporary-password-cache.service';
import { BcryptService } from '@integrations/security/bcrypt.service';
import { ChangePasswordDto } from '@resources/user/dto/change-password.dto';
import { CreateUserDTO } from '@resources/user/dto/create-user.dto';
import { RandomPasswordResponseDto } from '@resources/user/dto/random-password-response.dto';
import type { UpdateUserDTO } from '@resources/user/dto/update-user.dto';
import { UserEntity } from '@resources/user/user.entity';
import { UserRepository } from '@resources/user/user.repository';
import { Null } from '@typings/generic.typing';
import { JwtPayload } from '@typings/jwt.typing';
import { formatListString } from '@utils/format-list-string.util';
import { EnumConstNames } from 'ts-jenum';

@ServiceRepo(UserRepository)
export class UserService extends ServiceRepoAbstract<UserRepository> {
  private readonly MIN_PASSWORD_LENGTH = 8;

  constructor(
    private bcryptService: BcryptService,
    private temporaryPasswordCacheService: TemporaryPasswordCacheService,
  ) {
    super();
  }

  async findMany() {
    return this.repository.find();
  }

  async findOneByIdOrException(userId: string) {
    this.logger.info(`Buscando pelo id: ${userId}`);
    return this.repository.getUserByIdOrFail(userId);
  }

  async remove(userId: string) {
    this.logger.info(`Removendo usuário: ${userId}`);
    const user = await this.findOneByIdOrException(userId);
    await this.repository.softRemove(user);
  }

  async createCommonUser(
    createUserDTO: CreateUserDTO,
    useTemporaryPassword?: boolean,
  ) {
    this.logger.info(`Criando usuário: ${createUserDTO.email}`);
    const { role, ...newUser } = createUserDTO;

    await this.checkIfUserAlreadyExist(newUser.email);

    const user = new UserEntity();

    if (useTemporaryPassword) {
      newUser.password = this.getRandomPassword();
    }

    this.checkStrongPassword(newUser.password);

    user.name = newUser.name;
    user.email = newUser.email;
    user.password = this.bcryptService.hash(newUser.password);
    user.role = role;
    user.pendingIssues = [];

    if (useTemporaryPassword) {
      this.logger.info('Salvando senha temporária');
      user.pendingIssues.push(UserPendingIssuesEnum.TEMPORARY_PASSWORD);
      await this.temporaryPasswordCacheService.savePassword(
        user.id,
        newUser.password,
      );
    }

    await this.repository.save(user);

    return this.repository.findOneByOrFail({
      id: user.id,
    });
  }

  async update(userId: string, updateUserDTO: UpdateUserDTO) {
    this.logger.info('Atualizando usuário');
    const user = await this.findOneByIdOrException(userId);

    if (updateUserDTO.name) user.name = updateUserDTO.name;
    if (updateUserDTO.email) user.email = updateUserDTO.email;
    if (updateUserDTO.role) user.role = updateUserDTO.role;
    if (updateUserDTO.status) user.status = updateUserDTO.status;

    return this.repository.save(user);
  }

  async doLogin(identity: string, password: string) {
    this.logger.info(`Buscando usuário com: ${identity}`);
    const userOp =
      await this.repository.getUserByIdentityWithSalesPersonAndVendorPerson(
        identity,
      );

    const tokenType = this.getTokenType();
    const user = this.setUserDataContext(userOp, tokenType);

    this.checkUserPassword(user, password);
    await this.checkUserRoles(user);

    return user;
  }

  async getUserPendingIssues(userId: string) {
    this.logger.info('Iniciando busca de pendência do usuário');
    const user = await this.findOneByIdOrException(userId);

    return user.pendingIssues.map((e) => e.toJSON());
  }

  async changePassword(data: ChangePasswordDto) {
    this.logger.info('Iniciando alteração de senha');
    const userAuth = this.getUserAuthenticated();
    const user = await this.findOneByIdOrException(userAuth.id);
    this.checkStrongPassword(data.newPassword);
    this.checkUserPassword(user, data.oldPassword);

    user.password = this.bcryptService.hash(data.newPassword);
    user.pendingIssues = user.pendingIssues.filter(
      (pi) => pi !== UserPendingIssuesEnum.TEMPORARY_PASSWORD,
    );

    await this.temporaryPasswordCacheService.removePassword(user.id);

    this.logger.info('Salvando nova senha');
    await this.repository.save(user);
  }

  async getUserToLoginById(userId: string) {
    this.logger.info(`Buscando pelo id: ${userId}`);
    const userOp =
      await this.repository.getUserByIdWithSalesPersonAndVendorPerson(userId);
    if (!userOp) {
      throw new ApiErrorException('FORBIDDEN', 'PASSWORD_OR_EMAIL_WRONG');
    }

    return userOp;
  }

  async resetPassword(userId: string) {
    this.logger.info('Iniciando reset de senha');
    const user = await this.findOneByIdOrException(userId);
    const randomPassword = this.getRandomPassword();
    user.password = this.bcryptService.hash(randomPassword);
    user.pendingIssues.push(UserPendingIssuesEnum.TEMPORARY_PASSWORD);

    this.logger.info('Salvando nova senha do usuário');
    await this.repository.save(user);

    const expireIn = await this.temporaryPasswordCacheService.savePassword(
      userId,
      randomPassword,
    );

    return RandomPasswordResponseDto.toDto(
      randomPassword,
      expireIn.toISOString(),
    );
  }

  async getTemporaryPassword(userId: string) {
    const temporaryPasswordData =
      await this.temporaryPasswordCacheService.getTemporaryPassword(userId);

    if (!temporaryPasswordData) return RandomPasswordResponseDto.toDto(null);

    const { randomPassword, expireIn } = temporaryPasswordData;
    return RandomPasswordResponseDto.toDto(
      randomPassword,
      expireIn.toISOString(),
    );
  }

  async checkUserRoles(user: UserEntity) {
    const rolesKey = user.role.enumName as EnumConstNames<typeof RoleEnum>;
    this.logger.info(`Buscando informação do cargo: ${rolesKey}`);

    switch (rolesKey) {
      case 'ADMINISTRATOR':
        break;
      default: {
        this.logger.error('Erro ao buscar informações de cargo');
        this.logger.error(
          `Usuário possui o cargo [ ${rolesKey} ], porém não tem informação sobre o cargo nas tabelas ou não está mapeado`,
        );
        throw new ApiErrorException('UNAUTHORIZED', 'NOT_AUTHORIZED');
      }
    }
  }

  setUserDataContext(user: Null<UserEntity>, tokenType: JwtPayload['tt']) {
    if (!user) {
      throw new ApiErrorException('FORBIDDEN', 'PASSWORD_OR_EMAIL_WRONG');
    }

    this.ctx.setDataContext('user', {
      id: user.id,
      role: user.role,
      tokenType,
    });

    return user;
  }

  private checkUserPassword(user: UserEntity, password: string) {
    this.logger.info('Comparando senha com o hash');
    const { password: hashPassword } = user;
    const isOk = this.bcryptService.compare(password, hashPassword);

    if (!isOk) {
      throw new ApiErrorException('FORBIDDEN', 'PASSWORD_OR_EMAIL_WRONG');
    }
  }

  private async checkIfUserAlreadyExist(email: string) {
    this.logger.info('Verificando se cpf/cnpj já existe');
    const exist = await this.repository.existsBy([{ email }]);
    if (exist) {
      this.logger.error('Usuário já existe');
      throw new UnprocessableEntityException('USER_ALREADY_EXIST');
    }
  }

  private getTokenType(): JwtPayload['tt'] {
    const tokenTypeHeader = this.ctx.getRequestContext().header('sc') ?? '';
    const tokenTypeList: string[] = ['mb', 'wb', 'ex'] as JwtPayload['tt'][];
    if (tokenTypeList.includes(tokenTypeHeader))
      return tokenTypeHeader as JwtPayload['tt'];

    this.logger.error(
      `É necessário informar no header uma das seguintes fontes: ${tokenTypeList}`,
    );
    throw new UnprocessableEntityException('LOGIN_ERROR');
  }

  private checkStrongPassword(password: string) {
    const minLength = this.MIN_PASSWORD_LENGTH;

    const passwordValidations = [
      {
        check: (password: string) => password.length >= minLength,
        message: 'pelo menos 10 caracteres',
      },
      {
        check: (password: string) => /[A-Z]/.test(password),
        message: 'letra maiúscula',
      },
      {
        check: (password: string) => /[a-z]/.test(password),
        message: 'letra minúscula',
      },
      {
        check: (password: string) => /[0-9]/.test(password),
        message: 'números',
      },
      {
        check: (password: string) => /[!@#$%^&*(),.?:{}|<>]/.test(password),
        message: 'caractere especial',
      },
    ];

    const invalidConditions = passwordValidations.filter(
      (validation) => !validation.check(password),
    );

    if (invalidConditions.length) {
      const formattedMessage = formatListString(
        invalidConditions.map((condition) => condition.message),
      );
      throw new UnprocessableEntityException(
        'WEAK_PASSWORD',
        `Senha deve possuir ${formattedMessage}`,
      );
    }
  }

  private getRandomPassword(passwordLength = this.MIN_PASSWORD_LENGTH) {
    this.logger.info('Gerando senha');
    if (passwordLength < this.MIN_PASSWORD_LENGTH) {
      passwordLength = this.MIN_PASSWORD_LENGTH;
    }

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = lowercase.toUpperCase();
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*(),.?:{}|<>';

    const allChars = uppercase + lowercase + numbers + specialChars;

    let password = '';

    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i = password.length; i < passwordLength; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    this.logger.debug(`Senha gerada: ${password}`);

    return password;
  }
}
