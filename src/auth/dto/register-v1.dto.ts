import { Match } from '@src/common/lib/decorators/is-match.decorator';
import { Unique } from '@src/common/lib/decorators/is-unique.decorator';
import { UserEntity } from '@src/user/entities/user.entity';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterV1Dto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Unique(UserEntity)
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Unique(UserEntity)
  phone_number: string;

  @IsDate()
  @Type(() => Date)
  birth_date: Date;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password')
  password_confirmation: string;
}
