import { ContextService } from '@context/context.service';
import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { RedisClientOptions } from 'redis';
import { createKeyv } from '@keyv/redis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private ctx: ContextService) {}

  async createCacheOptions(): Promise<CacheOptions<RedisClientOptions>> {
    const redis = this.ctx.getConfig('redis');
    return createKeyv({
      password: redis.password,
      socket: {
        host: redis.host,
        port: redis.port,
      },
    });
  }
}
