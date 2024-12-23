import { ContextService } from '@context/context.service';
import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private ctx: ContextService) {}

  async createCacheOptions(): Promise<CacheOptions<RedisClientOptions>> {
    const { host, port, password } = this.ctx.getConfig('redis');
    return {
      store: redisStore,
      password,
      socket: {
        host: host,
        port: port,
      },
    };
  }
}
