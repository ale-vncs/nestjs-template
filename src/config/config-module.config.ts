import { appConfig } from '@config/system.config';
import { ConfigModule } from '@nestjs/config';

export const configModuleConfig = ConfigModule.forRoot({
  load: [appConfig],
  isGlobal: true,
});
