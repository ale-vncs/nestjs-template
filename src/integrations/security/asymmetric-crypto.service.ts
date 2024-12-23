import { privateDecrypt, privateEncrypt } from 'node:crypto';
import { ServiceAbstract } from '@abstracts/service.abstract';
import { Service } from '@decorators/service.decorator';

@Service()
export class AsymmetricCryptoService extends ServiceAbstract {
  encrypt(value: unknown) {
    return privateEncrypt('', Buffer.from(JSON.stringify(value))).toString(
      'base64',
    );
  }

  decrypt<T = unknown>(value: string) {
    return JSON.parse(
      privateDecrypt('', Buffer.from(value, 'base64')).toString(),
    ) as T;
  }
}
