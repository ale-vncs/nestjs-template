import { DisableUserPendingIssuesVerification } from '@decorators/disable-user-verification.decorator';
import { Roles } from '@decorators/roles.decorator';
import { RoleEnum } from '@enums/role.enum';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '@resources/user/dto/change-password.dto';
import { UpdateUserDTO } from '@resources/user/dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async find() {
    return await this.userService.findMany();
  }

  @Roles(RoleEnum.ADMINISTRATOR)
  @Get('/:id/temporary-password')
  async getTemporaryPassword(@Param('id') userId: string) {
    return await this.userService.getTemporaryPassword(userId);
  }

  @Roles(RoleEnum.ADMINISTRATOR)
  @Put('/:id/reset-password')
  async resetPassword(@Param('id') userId: string) {
    return await this.userService.resetPassword(userId);
  }

  @DisableUserPendingIssuesVerification()
  @Put('/change-password')
  async changePassword(@Body() body: ChangePasswordDto) {
    return await this.userService.changePassword(body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.userService.remove(id);
  }

  @Put('/:id')
  async put(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return await this.userService.update(id, body);
  }

  @Roles(RoleEnum.ADMINISTRATOR)
  @Get('/:id/pending-issues')
  async getUserPendingIssues(@Param('id') userId: string) {
    return await this.userService.getUserPendingIssues(userId);
  }
}
