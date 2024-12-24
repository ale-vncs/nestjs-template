import { ContextService } from '@context/context.service';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { CommonLogger } from '@logger/common-logger.abstract';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { Reflector } from '@nestjs/core';
import { AuthService } from '@resources/auth/auth.service';
import { UserEntity } from '@resources/user/user.entity';
import { TestContextService } from '@test/mocks/test-context.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class JwtAuthMockGuard extends JwtAuthGuard {
  constructor(
    private dataSource: DataSource,
    private authService: AuthService,
    private logger: CommonLogger,
    @Inject('TestContextService')
    private testContext: TestContextService,
    ctx: ContextService,
    reflector: Reflector,
  ) {
    super(reflector, ctx);
  }

  override async canActivate(context: ExecutionContext) {
    const userMockBuilder = this.testContext.userMockBuilder;
    const userMock = userMockBuilder.getUser();
    const autoLogin = userMockBuilder.getAutoLogin();
    const tokenType = userMockBuilder.getTokenType();
    const stayConnected = userMockBuilder.getStayConnected();
    const salt = this.ctx.getConfig('security').bcryptSalt;
    const req = context.switchToHttp().getRequest<Request>();

    const userEntity = new UserEntity();

    userEntity.id = userMock.id;
    userEntity.name = userMock.name;
    userEntity.email = userMock.email;
    userEntity.password = bcrypt.hashSync(userMock.password, salt);
    userEntity.role = userMock.role;
    userEntity.pendingIssues = userMock.pendingIssues;

    const userRepo = this.dataSource.getRepository(UserEntity);

    await userRepo.save(userEntity);

    this.ctx.setPartialDataContext('user', {
      tokenType,
    });

    if (super.isPublic(context)) return true;

    if (autoLogin) {
      this.logger.debug('========= Mocking login ==========');
      const accessToken = await this.authService.createAccessToken(
        userEntity,
        stayConnected,
      );
      req.headers.authorization = `Bearer ${accessToken}`;
      req.cookies.access_token = accessToken;
      this.logger.debug('========= End Mocking login ==========');
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
