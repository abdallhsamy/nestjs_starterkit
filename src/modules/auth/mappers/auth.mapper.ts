import { encodePassword } from '@src/common/lib/utils/bcrypt';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { EmailVerificationTokenEntity } from '../entities/email-verification-token.entity';

export class AuthMapper {
  public async prepareRegisterUserDataMapper(registerRequestData: any) {
    registerRequestData.password = await encodePassword(
      registerRequestData.password,
    );
    registerRequestData.password_confirmation = undefined;
    return registerRequestData;
  }

  public prepareUserPayload(user: any) {
    return {
      sub: user.id,
      name: user.name,
    };
  }

  public createAuthTokenMapper(user: UserEntity, token: number) {
    const emailVerificationToken = new EmailVerificationTokenEntity();
    emailVerificationToken.token = `${token}`;
    emailVerificationToken.user = user;

    return emailVerificationToken;
  }

  public forgotPasswordMapper(
    user: UserEntity,
    password: string,
    token: string,
  ) {
    return { user, password, token };
  }
}
