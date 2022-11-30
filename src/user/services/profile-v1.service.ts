import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateProfileV1Dto } from '@src/user/dto/update-profile-v1.dto';
import { ProfileV1Resource } from '@src/user/resources/profile-v1.resource';

export class ProfileV1Service {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async get() {
    const id = 1; // todo : get authenticated user

    const user = await this.userRepo
      .findOneBy({ id: id })
      .then((value: UserEntity) => {
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
