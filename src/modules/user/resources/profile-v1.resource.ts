import { UserEntity } from '../entities/user.entity';
import { ResourceResponse } from '@lib/classes/resource-response';

export class ProfileV1Resource extends ResourceResponse {
  static single(user: UserEntity) {
    return {
      data: this.#toArray(user),
    };
  }

  static collection(users: UserEntity[]) {
    return users.map((user: UserEntity) => this.#toArray(user));
  }

  static #toArray(user: UserEntity) {
    return {
      id: user['id'],
      name: user['name'],
      updated_at: user['updated_at'].toISOString().split('T')[0],
    };
  }
}
