import { ServiceAbstract } from '@abstracts/service.abstract';
import { Service } from '@decorators/service.decorator';
import * as bcrypt from 'bcrypt';

@Service()
export class BcryptService extends ServiceAbstract {
  hash(text: string) {
    this.logger.info('Gerando hash');
    this.logger.debug('Texto:', text);

    const salt = this.ctx.getConfig('security').bcryptSalt;
    const hash = bcrypt.hashSync(text, salt);

    this.logger.info('Hash concluido');
    return hash;
  }

  compare(text: string, hash: string) {
    this.logger.debug('Verificando hash com texto:', text);
    return bcrypt.compareSync(text, hash);
  }
}
