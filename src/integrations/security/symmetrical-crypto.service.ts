import crypto from 'node:crypto';
import { ServiceAbstract } from '@abstracts/service.abstract';
import { Service } from '@decorators/service.decorator';

@Service()
export class SymmetricalCryptoService extends ServiceAbstract {
  encrypt(value: unknown) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.getKey(), iv);

    let encrypted = cipher.update(JSON.stringify(value), 'utf-8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt<T = unknown>(value: string) {
    const textParts = value.split(':');
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedTextBuffer = Buffer.from(textParts[1], 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', this.getKey(), iv);
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return JSON.parse(decrypted.toString()) as T;
  }

  private getKey() {
    const sec = this.ctx.getConfig('security');
    const salt = crypto.randomBytes(16);
    return crypto.scryptSync(sec.cryptoSecret, 'salt', 32);
  }
}
