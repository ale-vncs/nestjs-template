import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common'
import helmet from 'helmet'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { systemConfig } from '@config/system.config'
import { ContextModule } from '@context/context.module'
import { ConfigMiddleware } from './middlewares/config.middleware'
import { LoggerModule } from '@logger/logger.module'
import { AllExceptionsFilter } from './filters/all-exceptions.filter'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ResponseInterceptor } from './interceptors/response.interceptor'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [systemConfig],
      isGlobal: true
    }),
    ContextModule,
    LoggerModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
      scope: Scope.DEFAULT
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    AppService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(helmet(), ConfigMiddleware).forRoutes('*')
  }
}
