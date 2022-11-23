import { RoleEntity } from './entities/role.entity';
import { ResourceResponse } from '../libs/classes/resource-response';
import {
  calculateRoleTaxes,
  getAvailableTaxes, getImageBasePath,
} from '../libs/utils/methods';
import { Transform } from 'class-transformer';

export class RoleResource extends ResourceResponse {
  static single(role: RoleEntity) {
    return this.#toArray(role);
  }

  static collection(roles: RoleEntity[]) {
    return roles.map((role) => this.#toArray(role));
  }

  static #toArray(role: RoleEntity) {
    return {
      id: role['id'],
      created_at: role['created_at'],
      name: role['name'],
    };
  }
}
