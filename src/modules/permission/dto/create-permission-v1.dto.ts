import { IsNotEmpty, IsString } from 'class-validator';
import { PermissionActionsEnum } from '../enums/permission-actions.enum';

export class CreatePermissionV1Dto {
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
