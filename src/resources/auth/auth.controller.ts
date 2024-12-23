import { Constants } from '@config/system.config';
import { Cookies } from '@decorators/cookies.decorator';
import {
  DisableUserDeviceVerification,
  DisableUserPendingIssuesVerification,
} from '@decorators/disable-user-verification.decorator';
import { Public } from '@decorators/public.decorator';
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';

@DisableUserPendingIssuesVerification()
@DisableUserDeviceVerification()
@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post('/login')
  async login(@Body() signInDto: SignInDTO) {
    return await this.authService.login(signInDto);
  }

  @HttpCode(200)
  @Post('/logout')
  async logout(@Cookies(Constants.ACCESS_TOKEN_KEY_NAME) accessToken: string) {
    await this.authService.logout(accessToken);
  }

  @Get('/me')
  async getCurrentUserAuthenticated() {
    return await this.authService.getCurrentUserAuthenticated();
  }

  @Get('/pending-issues')
  async getUserPendingIssues() {
    return await this.authService.getUserPendingIssues();
  }
}
