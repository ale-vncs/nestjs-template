import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { configModuleConfig } from '@config/config-module.config';
import { providerGlobal } from '@config/provider-global.config';
import { typeormModuleConfig } from '@config/typeorm-module.config';
import { ContextModule } from '@context/context.module';
import { CacheModule } from '@integrations/cache/cache.module';
import { SecurityModule } from '@integrations/security/security.module';
import { LoggerModule } from '@logger/logger.module';
import { ConfigMiddleware } from '@middlewares/config.middleware';
import { QueryParamMiddleware } from '@middlewares/query-param.middleware';

// Resources
import { AuthModule } from '@resources/auth/auth.module';
import { HealthModule } from '@resources/health/health.module';
import { UserModule } from '@resources/user/user.module';

@Module({
  imports: [
    configModuleConfig,
    typeormModuleConfig,
    CacheModule,
    HealthModule,
    ContextModule,
    LoggerModule,
    SecurityModule,
    AuthModule,
    UserModule,
  ],
  providers: [...providerGlobal],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(helmet(), cookieParser(), ConfigMiddleware, QueryParamMiddleware)
      .forRoutes('*');
  }
}
