import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionV1Dto } from './create-permission-v1.dto';

export class UpdatePermissionV1Dto extends PartialType(CreatePermissionV1Dto) {}
