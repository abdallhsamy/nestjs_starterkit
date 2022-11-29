import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfilePhotoV1Dto {
  @IsString()
  @IsNotEmpty()
  photo: string;
}
