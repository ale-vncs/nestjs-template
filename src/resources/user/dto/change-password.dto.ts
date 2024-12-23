import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(6)
  oldPassword!: string;

  @IsString()
  @Length(6)
  newPassword!: string;
}
