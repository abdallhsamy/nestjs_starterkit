import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoleV1Dto {
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateRoleTranslationDto)
  translations: CreateRoleTranslationDto[];

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  permissions: number[];
}

export class CreateRoleTranslationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  lang: string;
}
