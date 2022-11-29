type Gender = 'male' | 'female';
import {
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserV1Dto {
  @IsEmail()
  // is Unique
  email;

  @IsString()
  @IsNotEmpty()
  first_name;

  @IsString()
  last_name;

  @IsString()
  phone_number;

  @IsNotEmpty()
  password;
  birth_date;

  @IsOptional()
  verified_at: Date;

  @IsDefined()
  @IsString()
  @IsIn(['male', 'female'])
  gender: Gender;
}
