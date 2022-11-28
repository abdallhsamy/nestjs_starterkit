import { IsUnique } from '@youba/nestjs-dbvalidator';
import { IsString, IsNotEmpty, Validate } from 'class-validator';

export class ResetPasswordV1Dto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsUnique, [{ table: 'users', column: 'password' }])
  password: string;

  @IsString()
  @IsNotEmpty()
  password_confirmation: string;
}
