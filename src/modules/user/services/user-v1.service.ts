import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserV1Resource } from '../resources/user-v1.resource.js';
import { NotFoundException } from '@nestjs/common';
import { CreateUserV1Dto } from '../dto/create-user-v1.dto';
import { UpdateUserV1Dto } from '../dto/update-user-v1.dto';
import { RegisterV1Dto } from '@src/modules/auth/dto/register-v1.dto';

export class UserV1Service {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

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

    return { data: UserV1Resource.collection(users), meta };
  }

  async create(dto: CreateUserV1Dto) {
    const user = this.userRepo.create(dto);

    await this.userRepo.save(user);

    return await this.findOne(user.id);
  }

  async register(dto: RegisterV1Dto) {
    const user = this.userRepo.create(dto);

    await this.userRepo.save(user);

    return user;
  }

  async findOne(id?: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException();

    return user;
  }

  async findOneByKey(key: string, value: any) {
    const condition = {};
    condition[key] = value;

    return await this.userRepo.findOneBy(condition);
  }

  async update(id: number, updateUserDto: UpdateUserV1Dto) {
    await this.userRepo.update({ id }, updateUserDto);

    return await this.findOne(id);
  }

  async updateByKey(key: string, value: any, updateUserDto: UpdateUserV1Dto) {
    const condition = {};
    condition[key] = value;

    await this.userRepo.update(condition, updateUserDto);

    return await this.findOneByKey(key, value);
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

    return users;
  }

  async softDelete(id: number) {
    return await this.userRepo.softDelete(id);
  }
}
