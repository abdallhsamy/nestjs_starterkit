import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { isUnique } from '@src/libs/utils/database';
import { PermissionActionsEnum } from '@src/permission/enums/permission-actions.enum';
import { exists } from 'fs';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  action: PermissionActionsEnum;

  // @ValidateNested({each: true})
  // @IsArray()
  // @ArrayMinSize(1)
  // @Type(() => CreatePermissionTranslationDto)
  // translations: CreatePermissionTranslationDto[]

  // @ValidateNested({each: true})
  // @IsInt()
  // @Min(1)
  // @ArrayMinSize(ArrayMinSize1)
  // @exists()
  // @Type(() => [])
  // @IsNumber( )
  roles: any;
}

// export class CreatePermissionTranslationDto {
//
//   @IsNotEmpty()
//   @IsString()
//   @MaxLength(255)
//   name:string
//
//   @IsNotEmpty()
//   @IsString()
//   @MaxLength(255)
//   description:string
//
//   @IsNotEmpty()
//   @IsString()
//   @MaxLength(10)
//   lang:string
//
// }
