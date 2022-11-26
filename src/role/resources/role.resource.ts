import { RoleEntity } from '../entities/role.entity';
import { ResourceResponse } from '@lib/classes/resource-response';

export class RoleResource extends ResourceResponse {
  static single(role: RoleEntity) {
    return {
      data: this.#toArray(role),
    };
  }

  static collection(roles: RoleEntity[]) {
    return roles.map((role) => this.#toArray(role));
  }

  static #toArray(role: RoleEntity) {
    return {
      id: role['id'],
      name: role['name'],
      description: role['description'],
      created_at: role['created_at'].toISOString().split('T')[0],
    };
  }
}
