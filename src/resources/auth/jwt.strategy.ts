import { Constants } from '@config/system.config';
import { ContextService } from '@context/context.service';
import { CommonLogger } from '@logger/common-logger.abstract';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '@resources/auth/auth.service';
import { UserService } from '@resources/user/user.service';
import { JwtPayload } from '@typings/jwt.typing';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

const cookieExtractor = (req: Request) => {
  return req?.cookies?.[Constants.ACCESS_TOKEN_KEY_NAME] ?? '';
};

const extractors = ExtractJwt.fromExtractors([
  cookieExtractor,
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private logger: CommonLogger,
    private ctx: ContextService,
    private userService: UserService,
    private authService: AuthService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: extractors,
      ignoreExpiration: true,
      secretOrKey: ctx.getConfig('security').jwtSecret,
    });
    this.logger.setContext(JwtStrategy.name);
  }

  async validate(request: Request, payload: JwtPayload) {
    const { sub: userId, tt } = payload;
    const accessToken = extractors(request) ?? '';

    this.logger.info(`Token do tipo: ${tt}`);

    await this.authService.validateAccessTokenByUserId(
      userId,
      accessToken,
      payload,
    );

    this.logger.info(
      `Buscando dados do usuário [ ${userId} ] para inserir no contexto`,
    );
    const user = await this.userService.getUserToLoginById(userId);
    this.userService.setUserDataContext(user, tt);

    await this.userService.checkUserRoles(user);
    this.authService.checkEnvironment(user);
    await this.authService.renovateToken(user, accessToken, payload);

    this.logger.info(`Usuário [ ${user.name} ] inserido no contexto`);

    return {};
  }
}
