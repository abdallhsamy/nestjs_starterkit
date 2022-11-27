import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ApiResponse } from "@lib/errors/api-response";
import { RoleEntity } from '../entities/role.entity';
import { RoleTranslationEntity } from '../entities/role-translation.entity';
import { RoleV1Resource } from '../resources/role-v1.resource.js';
import { NotFoundException } from '@nestjs/common';
import { CreateRoleV1Dto } from '../dto/create-role-v1.dto';
import TranslationRepository from '@lib/repositories/translation.repository';
import { UpdateRoleV1Dto } from '../dto/update-role-v1.dto';
import { RolePermissionV1Service } from '../../permission/services/role-permission-v1.service';

export class RoleV1Service {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
    @InjectRepository(RoleTranslationEntity)
    private roleTranslationRepo: Repository<RoleTranslationEntity>,
    private readonly rolePermissionService: RolePermissionV1Service,
  ) {}

  async findAll(query) {
    const filter = {};

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

    return { data: RoleV1Resource.collection(roles), meta };
  }

  async create(dto: CreateRoleV1Dto) {
    // map request object for creating role with neglecting permissions array which
    // is used for assigning permissions to created role
    const createRoleRequest = { translations: dto.translations };

    const role = this.roleRepo.create(createRoleRequest);

    let roleToBeCreate: RoleEntity;

    if (dto.permissions && dto.permissions.length) {
      // get role with assigned permissions
      roleToBeCreate = await this.assignPermissionsToRoles(
        role,
        dto.permissions,
      );
    } else {
      roleToBeCreate = role;
    }

    await this.roleRepo.save(roleToBeCreate);

    await TranslationRepository.setTranslations(
      dto.translations,
      this.roleTranslationRepo,
      'role_id',
      role.id,
    );
    
    return await this.findOne(role.id);
  }

  async assignPermissionsToRoles(role: RoleEntity, permissionsIds: number[]) {
    return await this.rolePermissionService.assignPermissionsToRoles(
      role,
      permissionsIds,
    );
  }

  async findOne(id?: number) {
    const role = await this.roleRepo.findOneBy({ id: id }).then((value) => {
      if (!value) {
        throw new NotFoundException();
      }
      return value;
    });

    return RoleV1Resource.single(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleV1Dto) {
    const role = await this.roleRepo.findOneBy({ id: id }).then((value) => {
      if (!value) {
        throw new NotFoundException();
      }
      return value;
    });

    await this.roleRepo.update({ id }, {});

    await TranslationRepository.updateTranslations(
      'role_id',
      id,
      updateRoleDto.translations,
      this.roleTranslationRepo,
    );

    return await this.findOne(id);
  }

  async search(name) {
    let roles: any = await this.roleRepo.find({
      select: ['id'],
      where: {
        translations: {
          name: Like(`%${name}%`),
        },
      },
      relations: {},
    });

    roles = roles.map((role: RoleEntity) => {
      return {
        id: role['id'],
        name: role['name'],
      };
    });

    return ApiResponse.successResponse('roles', roles, 200);
  }

  async softDelete(id: number) {
    return await this.roleRepo.softDelete(id);
  }
}
