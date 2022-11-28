import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordV1Dto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  password_confirmation: string;
}
