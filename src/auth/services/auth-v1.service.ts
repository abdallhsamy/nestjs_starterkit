import { Injectable } from '@nestjs/common';
import { RegisterV1Dto } from "@src/auth/dto/register-v1.dto";
import { LoginV1Dto } from "@src/auth/dto/login-v1.dto";
import { ResetPasswordV1Dto } from "@src/auth/dto/reset-password-v1.dto";

@Injectable()
export class AuthV1Service {

  async register(dto: RegisterV1Dto) {
    return 'register'; // todo : implement register
  }

  async login(dto: LoginV1Dto) {
    return 'login'; // todo : implement login
  }

  async verify(token: string) {
    return 'verify'; // todo : implement verify
  }

  async resendVerification(email: string) {
    return 'resendVerification'; // todo : implement resendVerification
  }

  async forgotPassword(email: string) {
    return 'forgotPassword'; // todo : implement forgotPassword
  }

  async resetPassword(dto: ResetPasswordV1Dto) {
    return 'resetPassword'; // todo : implement resetPassword
  }
}
