import { LoggerAbstract } from '@abstracts/logger.abstract';
import { Logger } from '@decorators/logger.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisCache } from 'cache-manager-redis-yet';

@Injectable()
@Logger()
export class CacheService extends LoggerAbstract implements OnModuleDestroy {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {
    super();
  }

  public async set<T>(key: string, value: T, ttl?: number) {
    this.logger.debug(
      `Atribuindo valor [ ${JSON.stringify(value)} ] na chave [ ${key} ]`,
    );
    await this.cacheManager.set(this.getKey(key), JSON.stringify(value), ttl);
  }

  public async get<T>(key: string) {
    this.logger.debug(`Pegando valor da chave [ ${key} ]`);
    const value = await this.cacheManager.get<T>(this.getKey(key));
    if (value) return JSON.parse(value as string) as T;
    return undefined;
  }

  public async del(key: string) {
    this.logger.debug(`Removendo valor da chave [ ${key} ]`);
    await this.cacheManager.del(this.getKey(key));
  }

  private getKey(key: string) {
    return `${process.env.npm_package_name}:${key}`;
  }

  async close() {
    if (this.cacheManager.store.client) {
      await this.cacheManager.store.client.disconnect();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }
}
