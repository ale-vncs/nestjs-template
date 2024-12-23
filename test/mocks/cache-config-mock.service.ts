import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';

export class CacheConfigMockService implements CacheOptionsFactory {
  async createCacheOptions(): Promise<CacheOptions> {
    return {};
  }
}
