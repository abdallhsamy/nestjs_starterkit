import { IsExist } from '@lib/decorators/is-exist.decorator';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ResendVerificationV1Dto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsExist(UserEntity)
  email: string;
}
