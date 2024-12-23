import { RoleEnum } from '@enums/role.enum';
import { Null } from '@typings/generic.typing';
import { JwtPayload } from '@typings/jwt.typing';
import { Request } from 'express';

const context = ['api', 'scheduler'] as const;

export type AppContextType = (typeof context)[number];

export interface ContextKeys {
  req: Request;
  logger: {
    pathToIgnore: string[];
    transactionId: string;
    context: AppContextType;
  };
  cookie: {
    accessToken: Null<string>;
  };
  user: {
    id: string;
    role: RoleEnum;
    tokenType: JwtPayload['tt'];
  };
}
