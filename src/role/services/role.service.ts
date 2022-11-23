import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { ApiResponse } from '../../libs/errors/api-response';
import { RoleEntity } from '../entities/role.entity';
import { RoleTranslationEntity } from "../entities/role-translation.entity";
import { RoleResource } from '../resources/role.resource';
import { NotFoundException } from "@nestjs/common";

export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private repo: Repository<RoleEntity>,
    @InjectRepository(RoleTranslationEntity)
    private roleTranslationRepository: Repository<RoleTranslationEntity>,
  ) {}

  async findAll(query) {
    let filter = {};

    if (query['name']) {
      filter['translations'] = { name: Like(`%${query['name']}%`) };
    }

    const perPage = 8;
    const [roles, total] = await this.repo.findAndCount({
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
    if (!id || isNaN(id)) {
      throw NotFoundException;
    }
    const role = await this.repo.findOne({
      where: {
        id : id,
      },
    });

    if(!role){
      throw new NotFoundException(`there is nor role with id ${id}`)
    }


    return ApiResponse.successResponse(
      'role',
      RoleResource.single(role),
      200,
    );
  }

  async search(name) {
    let roles: any = await this.repo.find({
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
