import { IsExist } from '@lib/decorators/is-exist.decorator';
import { Match } from '@lib/decorators/is-match.decorator';
import { IsString, IsNotEmpty } from 'class-validator';
import { ForgetPasswordTokenEntity } from '../entities/forget-password-token.entity';

export class ResetPasswordV1Dto {
  @IsString()
  @IsNotEmpty()
  @IsExist(ForgetPasswordTokenEntity)
  token: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password')
  password_confirmation: string;
}
