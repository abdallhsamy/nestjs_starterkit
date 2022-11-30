import { IsExist } from '@src/common/lib/decorators/is-exist.decorator';
import { UserEntity } from '@src/user/entities/user.entity';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordV1Dto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsExist(UserEntity)
  email: string;
}
