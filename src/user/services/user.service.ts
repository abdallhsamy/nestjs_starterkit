import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ApiResponse } from "@lib/errors/api-response";
import { UserEntity } from '../entities/user.entity';
import { UserResource } from '../resources/user.resource.js';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}

  async findAll(query) {
    const filter = {};

    if (query['name']) {
      filter['translations'] = { name: Like(`%${query['name']}%`) };
    }

    const perPage = 8;
    const [users, total] = await this.userRepo.findAndCount({
      where: filter,
      order: { [query['sort_key'] ?? 'id']: query['sort_type'] ?? 'asc' },
      take: perPage,
      skip: ((query['page'] ?? 1) - 1) * perPage,
    });

    const meta = {
      current_page: query['page'] ?? 1,
      last_page: Math.ceil(total / perPage),
      total,
    };

    return { data: UserResource.collection(users), meta };
  }

  async create(dto: CreateUserDto) {
    const user = this.userRepo.create(dto);

    await this.userRepo.save(user);

    return await this.findOne(user.id);
  }

  async findOne(id?: number) {
    const user = await this.userRepo.findOneBy({ id: id }).then((value) => {
      if (!value) {
        throw new NotFoundException();
      }
      return value;
    });

    return UserResource.single(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id: id }).then((value) => {
      if (!value) {
        throw new NotFoundException();
      }
      return value;
    });

    await this.userRepo.update({ id }, {});

    return await this.findOne(id);
  }

  async search(name) {
    let users: any = await this.userRepo.find({
      select: ['id'],
      relations: {},
    });

    users = users.map((user: UserEntity) => {
      return {
        id: user['id'],
        name: user['name'],
      };
    });

    return ApiResponse.successResponse('users', users, 200);
  }

  async softDelete(id: number) {
    return await this.userRepo.softDelete(id);
  }
}
