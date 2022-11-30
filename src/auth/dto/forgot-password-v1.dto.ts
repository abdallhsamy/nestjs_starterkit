import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class ForgotPasswordV1Dto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
