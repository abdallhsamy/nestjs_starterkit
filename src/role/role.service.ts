import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { ApiResponse } from '../libs/errors/api-response';
import { RoleEntity } from './entities/role.entity';
import { RoleTrEntity } from './entities/role-tr.entity';
import source from '../ormconfig';
import { RoleResource } from './role.resource';
import { calculateRoleTaxes } from '../libs/utils/methods';

export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(RoleTrEntity)
    private roleTrRepository: Repository<RoleTrEntity>,
  ) {}

  async findAll(query) {
    let filter = {};

    if (query['category']) filter['categoryId'] = query['category'];

    if (query['tag']) filter['tags'] = { id: query['tag'] };

    if (query['name'])
      filter['translations'] = { name: Like(`%${query['name']}%`) };

    const perPage = 8;
    const [roles, total] = await this.roleRepository.findAndCount({
      where: filter,
      order: { [query['sort_key'] ?? 'id']: query['sort_type'] ?? 'asc' },
      relations: {
      },
      take: perPage,
      skip: ((query['page'] ?? 1) - 1) * perPage,
    });

    const meta = {
      current_page: query['page'] ?? 1,
      last_page: Math.ceil(total / perPage),
      total,
    };

    return ApiResponse.successResponse(
      'all roles',
      { roles: RoleResource.collection(roles), meta },
      200,
    );
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
      relations: {
      },
    });

    role['related_roles'] = await this.roleRepository.find({
      where: { categoryId: role['categoryId'], id: Not(id) },
      relations: {
      },
      take: 6,
    });

    return ApiResponse.successResponse(
      'role',
      RoleResource.single(role),
      200,
    );
  }

  async search(roleName) {
    let roles: any = await this.roleRepository.find({
      select: ['id', 'mainImage', 'categoryId'],
      where: {
        translations: {
          name: Like(`%${roleName}%`),
        },
      },
      relations: {
      },
    });

    roles = roles.map((role: RoleEntity) => {
      return {
        id: role['id'],
        name: role['name'],
        category: role['category']['name'],
        price: +role['price'] + calculateRoleTaxes(role['price']),
        mainImage:
          process.env.dashboard_base_url + 'storage/Images/' + role['mainImage'],
      };
    });

    return ApiResponse.successResponse('roles', roles, 200);
  }
}
