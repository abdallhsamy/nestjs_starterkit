import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleV1Dto } from './create-role-v1.dto';

export class UpdateRoleV1Dto extends PartialType(CreateRoleV1Dto) {}
