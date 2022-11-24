import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { ApiResponse } from '../../libs/errors/api-response';
import { RoleEntity } from '../entities/role.entity';
import { RoleTranslationEntity } from "../entities/role-translation.entity";
import { RoleResource } from '../resources/role.resource.js';
import { NotFoundException } from "@nestjs/common";

export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
    @InjectRepository(RoleTranslationEntity)
    private roleTranslationRepo: Repository<RoleTranslationEntity>,
  ) {}

  async findAll(query) {
    let filter = {};

    if (query['name']) {
      filter['translations'] = { name: Like(`%${query['name']}%`) };
    }

    const perPage = 8;
    const [roles, total] = await this.roleRepo.findAndCount({
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

    return { data: RoleResource.collection(roles), meta };
  }

  async findOne(id?: number) {

    const role = await this.roleRepo.findOneBy({ id : id, })
      .then(value => {if (! value) {throw new NotFoundException();} return value;});

    return RoleResource.single(role);
  }

  async search(name) {
    let roles: any = await this.roleRepo.find({
      select: ['id'],
      where: {
        translations: {
          name: Like(`%${name}%`),
        },
      },
      relations: {
      },
    });

    roles = roles.map((role: RoleEntity) => {
      return {
        id: role['id'],
        name: role['name'],
      };
    });

    return ApiResponse.successResponse('roles', roles, 200);
  }
}
