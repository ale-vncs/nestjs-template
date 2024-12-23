import { AsymmetricCryptoService } from '@integrations/security/asymmetric-crypto.service';
import { BcryptService } from '@integrations/security/bcrypt.service';
import { SecurityService } from '@integrations/security/security.service';
import { SymmetricalCryptoService } from '@integrations/security/symmetrical-crypto.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    SecurityService,
    BcryptService,
    AsymmetricCryptoService,
    SymmetricalCryptoService,
  ],
  exports: [
    SecurityService,
    BcryptService,
    AsymmetricCryptoService,
    SymmetricalCryptoService,
  ],
})
export class SecurityModule {}
