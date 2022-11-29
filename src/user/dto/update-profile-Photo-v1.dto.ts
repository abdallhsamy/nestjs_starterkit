import { PartialType } from '@nestjs/mapped-types';
import { CreateUserV1Dto } from './create-user-v1.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfilePhotoV1Dto {
  @IsString()
  @IsNotEmpty()
  photo: string;
}
