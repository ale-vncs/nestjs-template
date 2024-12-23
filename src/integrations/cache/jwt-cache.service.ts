import { CacheService } from '@integrations/cache/cache.service';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@typings/jwt.typing';
import { differenceInMinutes } from 'date-fns';

@Injectable()
export class JwtCacheService {
  constructor(private cacheService: CacheService) {}

  public async removeAccessTokenByUserId(userId: string, accessToken: string) {
    const { exp } = this.getPayloadToken(accessToken);
    await this.addAccessTokenInBlackList(userId, accessToken, exp);
  }

  public async isAccessTokenInBlacklist(userId: string, token: string) {
    const blacklistToken = await this.getBlacklistTokenByUserId(userId);
    return blacklistToken.some((bl) => bl.token === token);
  }

  private async addAccessTokenInBlackList(
    userId: string,
    accessToken: string,
    expToken: number,
  ) {
    const blackListCacheKey = this.getUserTokenBlacklistKey(userId);
    let accessTokenBlackList = await this.getBlacklistTokenByUserId(userId);

    accessTokenBlackList = accessTokenBlackList.filter(({ exp }) => {
      const expDate = new Date(exp * 1000);
      const currentDate = new Date();
      const diff = differenceInMinutes(expDate, currentDate);
      return diff > 0;
    });

    accessTokenBlackList.push({ token: accessToken, exp: expToken });
    await this.cacheService.set(blackListCacheKey, accessTokenBlackList, 0);
  }

  private async getBlacklistTokenByUserId(userId: string) {
    const blackListCacheKey = this.getUserTokenBlacklistKey(userId);
    return (
      (await this.cacheService.get<{ token: string; exp: number }[]>(
        blackListCacheKey,
      )) ?? []
    );
  }

  private getPayloadToken(token: string) {
    const payload = Buffer.from(token.split('.')[1], 'base64').toString(
      'utf-8',
    );
    return JSON.parse(payload) as JwtPayload;
  }

  private getUserTokenBlacklistKey(userId: string) {
    return `user:token:blacklist:${userId}`;
  }
}
