import { LoggerAbstract } from '@abstracts/logger.abstract';
import { Logger } from '@decorators/logger.decorator';
import { CacheService } from '@integrations/cache/cache.service';
import { SymmetricalCryptoService } from '@integrations/security/symmetrical-crypto.service';
import { addHours, hoursToMilliseconds } from 'date-fns';

interface TemporaryPasswordData {
  password: string;
  createdAt: string;
}

@Logger()
export class TemporaryPasswordCacheService extends LoggerAbstract {
  private readonly HOUR_TO_EXPIRE_TEMPORARY_PASSWORD = 24;

  constructor(
    private cacheService: CacheService,
    private symmetricalCrypto: SymmetricalCryptoService,
  ) {
    super();
  }

  async savePassword(userId: string, password: string) {
    this.logger.info('Salvando senha temporária no cache');
    const currentDate = new Date();
    const passwordWithCrypto = this.symmetricalCrypto.encrypt(password);

    await this.cacheService.set<TemporaryPasswordData>(
      this.getKey(userId, 'temporary-password'),
      {
        password: passwordWithCrypto,
        createdAt: currentDate.toISOString(),
      },
      hoursToMilliseconds(this.HOUR_TO_EXPIRE_TEMPORARY_PASSWORD),
    );

    return addHours(currentDate, this.HOUR_TO_EXPIRE_TEMPORARY_PASSWORD);
  }

  async removePassword(userId: string) {
    this.logger.info('Removendo senha temporária do cache');
    await this.cacheService.del(this.getKey(userId, 'temporary-password'));
  }

  async getTemporaryPassword(userId: string) {
    const data = await this.cacheService.get<TemporaryPasswordData>(
      this.getKey(userId, 'temporary-password'),
    );

    if (!data) return null;

    const randomPassword = this.symmetricalCrypto.decrypt<string>(
      data?.password,
    );

    return {
      randomPassword,
      expireIn: addHours(
        data.createdAt,
        this.HOUR_TO_EXPIRE_TEMPORARY_PASSWORD,
      ),
    };
  }

  private getKey(userId: string, code: string) {
    const key = code.replace(/-/g, ':');
    return `${key}:${userId}`;
  }
}
