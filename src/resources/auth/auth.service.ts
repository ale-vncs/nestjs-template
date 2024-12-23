import { ServiceAbstract } from '@abstracts/service.abstract';
import { Service } from '@decorators/service.decorator';
import { RoleEnum } from '@enums/role.enum';
import { ApiErrorException } from '@exceptions/api-error.exception';
import { JwtCacheService } from '@integrations/cache/jwt-cache.service';
import { JwtService } from '@nestjs/jwt';
import { UserAuthenticatedResponseDto } from '@resources/auth/dto/user-authenticated-response.dto';
import { UserEntity } from '@resources/user/user.entity';
import { UserService } from '@resources/user/user.service';
import { JwtPayload, JwtPayloadUserInfo } from '@typings/jwt.typing';
import { differenceInMinutes } from 'date-fns';
import { v4 } from 'uuid';
import type { SignInDTO } from './dto/sign-in.dto';

@Service()
export class AuthService extends ServiceAbstract {
  private readonly MINUTES_IN_SECONDS = 60;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private jwtCacheService: JwtCacheService,
  ) {
    super();
  }

  async getCurrentUserAuthenticated() {
    const user = this.getUserAuthenticated();
    return UserAuthenticatedResponseDto.fromUserEntity(
      await this.userService.findOneByIdOrException(user.id),
    );
  }

  async getUserPendingIssues() {
    const currentUser = this.getUserAuthenticated();
    return this.userService.getUserPendingIssues(currentUser.id);
  }

  async login(signInDTO: SignInDTO) {
    this.logger.info('Iniciando login');
    const user = await this.userService.doLogin(
      signInDTO.identity,
      signInDTO.password,
    );

    this.checkEnvironment(user);

    const accessToken = await this.createAccessToken(
      user,
      signInDTO.stayConnected,
    );

    this.ctx.setDataContext('cookie', {
      accessToken,
    });

    return UserAuthenticatedResponseDto.fromUserEntity(user);
  }

  async logout(accessToken: string) {
    this.logger.info('Finalizando login');
    const user = this.ctx.getDataContextThrow('user');
    await this.jwtCacheService.removeAccessTokenByUserId(user.id, accessToken);
    this.ctx.setDataContext('cookie', {
      accessToken: null,
    });
  }

  async createAccessToken(user: UserEntity, stayConnected: boolean) {
    this.logger.info('Gerando token de acesso');
    const { jwtSecret, jwtTTLInMinutes } = this.ctx.getConfig('security');
    const tokenType = this.ctx.getDataContextThrow('user').tokenType;

    const payload: JwtPayloadUserInfo = {
      jti: v4(),
      sub: user.id,
      sc: stayConnected,
      tt: tokenType,
      iat: Date.now(),
      nbf: Math.floor(Date.now() / 1000),
    };

    let expiresIn: string | number = jwtTTLInMinutes * this.MINUTES_IN_SECONDS;

    if (stayConnected) {
      expiresIn = '7d';
    }

    return this.jwtService.sign(payload, {
      expiresIn,
      secret: jwtSecret,
    });
  }

  async renovateToken(user: UserEntity, token: string, payload: JwtPayload) {
    const { renovateInMinutes } = this.ctx.getConfig('security');
    const { exp } = payload;
    const remainingMinutes = this.catchRemainingMinutesToExpireToken(exp);

    let accessToken = token;

    if (remainingMinutes <= renovateInMinutes && !payload.sc) {
      this.logger.info('Renovando token');
      accessToken = await this.createAccessToken(user, false);
      await this.jwtCacheService.removeAccessTokenByUserId(user.id, token);
    }

    this.ctx.setDataContext('cookie', {
      accessToken,
    });
  }

  async validateAccessTokenByUserId(
    userId: string,
    token: string,
    payload: JwtPayload,
  ) {
    this.logger.info('Verificando se token está na blacklist');
    const existToken = await this.jwtCacheService.isAccessTokenInBlacklist(
      userId,
      token,
    );
    const remainingMinutes = this.catchRemainingMinutesToExpireToken(
      payload.exp,
    );
    const tokenExpired = remainingMinutes <= 0;

    if (existToken || tokenExpired) {
      this.logger.debug(
        `Token in blacklist: ${existToken} || Token expired: ${tokenExpired}`,
      );
      throw new ApiErrorException('UNAUTHORIZED', 'USER_TOKEN_INVALID');
    }
  }

  checkEnvironment(user: UserEntity) {
    this.logger.info('Checando cargos com ambiente requisitado');

    const tokenType = this.ctx.getDataContextThrow('user').tokenType;

    this.logger.debug(`Cargo: ${user.role}`);
    this.logger.debug(`Ambiente: ${tokenType}`);

    const tokenTypeRoleMap: Record<JwtPayload['tt'], RoleEnum[]> = {
      wb: [RoleEnum.ADMINISTRATOR],
    };

    const rolesByTokenType = tokenTypeRoleMap[tokenType];

    if (!rolesByTokenType.includes(user.role)) {
      this.logger.error(
        'Usuário não possui os cargos necessários para acessar o sistema',
      );
      this.logger.error(`Cargos necessários: ${rolesByTokenType}`);
      throw new ApiErrorException('UNAUTHORIZED', 'NOT_AUTHORIZED');
    }
  }

  private catchRemainingMinutesToExpireToken(exp: number) {
    const expDate = new Date(exp * 1000);
    return differenceInMinutes(expDate, Date.now());
  }
}
