import { encodePassword } from '@src/common/lib/utils/bcrypt';
import { UserEntity } from '@src/user/entities/user.entity';

export class AuthMapper {
  public async prepareRegisterUserDataMapper(registerRequestData: any) {
    registerRequestData.password = await encodePassword(
      registerRequestData.password,
    );
    return registerRequestData;
  }

  public prepareUserPayload(user: UserEntity) {
    return {
      sub: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phone: user.phone_number,
    };
  }
}
