import { PartialType } from '@nestjs/mapped-types';
import { CreateUserV1Dto } from './create-user-v1.dto';

export class UpdateUserV1Dto extends PartialType(CreateUserV1Dto) {}
