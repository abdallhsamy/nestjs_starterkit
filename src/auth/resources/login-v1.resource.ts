import { ResourceResponse } from '@lib/classes/resource-response';
import { UserEntity } from '@src/user/entities/user.entity';

export class LoginV1Resource extends ResourceResponse {
  static single(user: UserEntity, token: string) {
    return {
      data: this.#toArray(user, token),
    };
  }

  static #toArray(user: UserEntity, token: string) {
    return {
      name: user['name'],
      token: token,
    };
  }
}
