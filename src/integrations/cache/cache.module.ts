import { CacheConfigService } from '@integrations/cache/cache-config.service';
import { CacheService } from '@integrations/cache/cache.service';
import { JwtCacheService } from '@integrations/cache/jwt-cache.service';
import { TemporaryPasswordCacheService } from '@integrations/cache/temporary-password-cache.service';
import { CacheModule as CacheModuleNestJs } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { RedisClientOptions } from 'redis';

@Global()
@Module({
  imports: [
    CacheModuleNestJs.registerAsync<RedisClientOptions>({
      useClass: CacheConfigService,
    }),
  ],
  providers: [CacheService, JwtCacheService, TemporaryPasswordCacheService],
  exports: [CacheService, JwtCacheService, TemporaryPasswordCacheService],
})
export class CacheModule {}
