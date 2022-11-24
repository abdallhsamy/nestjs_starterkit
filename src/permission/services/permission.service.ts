import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { ApiResponse } from '@src/libs/errors/api-response';
import { PermissionEntity } from '../entities/permission.entity';
import { PermissionResource } from '../resources/permission.resource.js';
import { NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepo: Repository<PermissionEntity>,
  ) {}

  async findAll(query) {
    const filter = {};

    // if (query['name']) {
    //   filter['translations'] = { name: Like(`%${query['name']}%`) };
    // }

    const perPage = 8;
    const [permissions, total] = await this.permissionRepo.findAndCount({
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

    return { data: PermissionResource.collection(permissions), meta };
  }

  async create(dto: CreatePermissionDto) {
    const permission = this.permissionRepo.create(dto);

    await this.permissionRepo.save(permission);

    // todo : attach roles

    return await this.findOne(permission.id);
  }

  async findOne(id?: number) {
    const permission = await this.permissionRepo
      .findOneBy({ id: id })
      .then((value) => {
        if (!value) {
          throw new NotFoundException();
        }
        return value;
      });

    return PermissionResource.single(permission);
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepo
      .findOneBy({ id: id })
      .then((value) => {
        if (!value) {
          throw new NotFoundException();
        }
        return value;
      });

    await this.permissionRepo.update({ id }, {});

    // todo : update roles if provided

    return await this.findOne(id);
  }

  async search(name) {
    let permissions: any = await this.permissionRepo.find({
      select: ['id'],
      where: {
        model: Like(`%${name}%`),
        // todo : or where action like name
        // todo : or where split space and search
      },
      relations: {
        // todo : add relationship to roles
      },
    });

    permissions = permissions.map((permission: PermissionEntity) => {
      return {
        id: permission['id'],
        name: permission['name'],
      };
    });

    return ApiResponse.successResponse('permissions', permissions, 200);
  }

  async softDelete(id: number) {
    return await this.permissionRepo.softDelete(id);
  }
}
