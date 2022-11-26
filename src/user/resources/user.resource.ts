import { UserEntity } from '../entities/user.entity';
import { ResourceResponse } from '@lib/classes/resource-response';

export class UserResource extends ResourceResponse {
  static single(user: UserEntity) {
    return {
      data: this.#toArray(user),
    };
  }

  static collection(users: UserEntity[]) {
    return users.map((user) => this.#toArray(user));
  }

  static #toArray(user: UserEntity) {
    return {
      id: user['id'],
      name: user['name'],
      created_at: user['created_at'].toISOString().split('T')[0],
    };
  }
}
