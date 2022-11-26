import { PermissionEntity } from '../entities/permission.entity';
import { ResourceResponse } from '@lib/classes/resource-response';

export class PermissionResource extends ResourceResponse {
  static single(permission: PermissionEntity) {
    return {
      data: this.#toArray(permission),
    };
  }

  static collection(permissions: PermissionEntity[]) {
    return permissions.map((permission) => this.#toArray(permission));
  }

  static #toArray(permission: PermissionEntity) {
    return {
      id: permission['id'],
      name: permission['name'],
      model: permission['model'],
      action: permission['action'],
      created_at: permission['created_at'].toISOString().split('T')[0],
    };
  }
}
