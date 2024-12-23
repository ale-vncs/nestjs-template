import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty()
  identity!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsBoolean()
  stayConnected = false;
}
