import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ApiResponse } from "@lib/errors/api-response";
import { UserEntity } from '../entities/user.entity';
import { UserV1Resource } from '../resources/user-v1.resource.js';
import { NotFoundException } from '@nestjs/common';
import { CreateUserV1Dto } from '../dto/create-user-v1.dto';
import { UpdateUserV1Dto } from '../dto/update-user-v1.dto';
import { UpdateProfileV1Dto } from "@src/user/dto/update-profile-v1.dto";
import { ProfileV1Resource } from "@src/user/resources/profile-v1.resource";

export class ProfileV1Service {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}

  async get() {
    const id = 1; // todo : get authenticated user

    const user = await this.userRepo.findOneBy({ id: id }).then((value : UserEntity) => {
      if (!value) {
        throw new NotFoundException();
      }
      return value;
    });

    return ProfileV1Resource.single(user);
  }

  async update(updateProfileDto: UpdateProfileV1Dto) {
    const id = 1; // todo : get authenticated user
    const user = await this.userRepo.findOneBy({ id: id }).then((value) => {
      if (!value) {
        throw new NotFoundException();
      }
      return value;
    });

    await this.userRepo.update({ id }, {});

    // return await this.findOne(id);
  }
}
