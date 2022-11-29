import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LoginV1Dto } from '@src/auth/dto/login-v1.dto';
import { ResetPasswordV1Dto } from '@src/auth/dto/reset-password-v1.dto';
import { UserV1Service } from '@src/user/services/user-v1.service';
import { comparePasswords } from '@src/common/lib/utils/bcrypt';
import { AuthMapper } from '../mappers/auth.mapper';
import { JwtService } from '@nestjs/jwt';
import { generateToken } from '@src/common/lib/utils/jwt';

@Injectable()
export class AuthV1Service {
  private authMapper: AuthMapper;
  constructor(
    private readonly userService: UserV1Service,
    private readonly jwtService: JwtService,
  ) {
    this.authMapper = new AuthMapper();
  }

  public async register(dto: any) {
    // prepare user data for registeration
    const registerRequestData =
      await this.authMapper.prepareRegisterUserDataMapper(dto);

    // start register user
    return await this.userService.create(registerRequestData);
  }

  public async login(dto: LoginV1Dto) {
    // get user data by email with validation on email and password
    const user = await this.validateLogin(dto.email, dto.password);

    // generate token from user payload
    const userPayload = this.authMapper.prepareUserPayload(user);
    const token = generateToken(userPayload, this.jwtService);

    return { token };
  }

  public async verify(token: string) {
    return 'verify'; // todo : implement verify
  }

  public async resendVerification(email: string) {
    return 'resendVerification'; // todo : implement resendVerification
  }

  public async forgotPassword(email: string) {
    return 'forgotPassword'; // todo : implement forgotPassword
  }

  public async resetPassword(dto: ResetPasswordV1Dto) {
    return 'resetPassword'; // todo : implement resetPassword
  }

  private async validateLogin(email: string, password: string) {
    // get user data by email
    const user = await this.userService.findOneByKey('email', email);
    if (!user) throw new NotFoundException("User isn't registered");

    // check passwords matching
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) throw new UnprocessableEntityException('Passwords mismatch');

    return user;
  }
}
