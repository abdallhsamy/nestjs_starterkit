type Gender = 'male' | 'female';
import { IsDefined, IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  // is Unique
  email

  @IsString()
  @IsNotEmpty()
  first_name

  @IsString()
  last_name

  @IsString()
  phone_number

  @IsNotEmpty()
  password
  birth_date

  @IsDefined()
  @IsString()
  @IsIn(['male', 'female'])
  gender : Gender;
}

