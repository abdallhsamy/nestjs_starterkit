import { RoleEntity } from '../entities/role.entity';
import { ResourceResponse } from '../../libs/classes/resource-response';

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
