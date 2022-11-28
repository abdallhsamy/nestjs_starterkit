import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginV1Dto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
