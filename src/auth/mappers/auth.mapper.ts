import { encodePassword } from '@src/common/lib/utils/bcrypt';
import { UserEntity } from '@src/user/entities/user.entity';
import { CreateAuthTokenInterface } from '../dto/login-v1.dto';
import { AuthTokenEntity } from '../entities/auth-token.entity';

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

  public createAuthTokenMapper(user: UserEntity, token: string) {
    const authToken = new AuthTokenEntity();
    authToken.token = token;
    authToken.user = user;
    
    return authToken;
  }

  public forgotPasswordMapper(user: UserEntity, password: string, token: string) {
    return { user, password, token };
  }
}
