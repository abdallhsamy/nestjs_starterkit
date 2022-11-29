import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LoginV1Dto } from '@src/auth/dto/login-v1.dto';
import { ResetPasswordV1Dto } from '@src/auth/dto/reset-password-v1.dto';
import { UserV1Service } from '@src/user/services/user-v1.service';
import { comparePasswords, encodePassword } from '@src/common/lib/utils/bcrypt';
import { AuthMapper } from '../mappers/auth.mapper';
import { JwtService } from '@nestjs/jwt';
import { generateToken } from '@src/common/lib/utils/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@src/user/entities/user.entity';
import { generateRandomText } from '@src/common/lib/utils/random.';
import { ForgetPasswordV1Service } from './forget-password-v1.service';
import { ForgotPasswordV1Dto } from '../dto/forgot-password-v1.dto';
import { EmailVerificationTokenEntity } from "@src/auth/entities/email-verification-token.entity";
import config from "@config/index";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthV1Service {
  private authMapper: AuthMapper;
  constructor(
    @InjectRepository(EmailVerificationTokenEntity) private emailVerificationTokenRepo: Repository<EmailVerificationTokenEntity>,
    private readonly userService: UserV1Service,
    private readonly forgetPassService: ForgetPasswordV1Service,
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
    const user = await this.getUserByKey('email', dto.email);

    if (! bcrypt.compareSync(dto.password, user.password)) {
      throw new UnprocessableEntityException('Passwords mismatch');
    }

    const userPayload = this.authMapper.prepareUserPayload(user);

    const jwtService = new JwtService()

    const token = jwtService.sign(userPayload, { secret: config('app.secret_key') });

    const emailVerificationToken = await this.createAuthToken(user, token);

    return { token: emailVerificationToken.token };
  }

  public async verify(currentUser: UserEntity) {
    return await this.userService.update(currentUser.id, { verified_at: new Date() });
  }

  public async resendVerification(email: string) {
    return 'resendVerification'; // todo : implement resendVerification
  }

  public async forgotPassword(forgetPassDto: ForgotPasswordV1Dto) {
    // fetch user data by email
    const user = await this.userService.findOneByKey('email', forgetPassDto.email);

    // generate password instead of the forgotten one and hash it
    const password = await encodePassword(generateRandomText(5));

    // map forget password request
    const forgotPasswordRequest = this.authMapper.forgotPasswordMapper(user, password, forgetPassDto.token);

    // create new password for the user and save in forget password table
    return await this.forgetPassService.forgetPassword(forgotPasswordRequest);
  }

  public async resetPassword(dto: ResetPasswordV1Dto) {
    return 'resetPassword'; // todo : implement resetPassword
  }

  private async getUserByKey(key: string, value: any) {
    const user = await this.userService.findOneByKey(key, value);
    if (!user) throw new NotFoundException("User isn't registered");

    return user;
  }

  private async createAuthToken(user: UserEntity, token: string) {
    // map auth token data for creating it
    const emailVerificationToken = this.authMapper.createAuthTokenMapper(user, token);

    // create auth token data to database
    const createAuthTokenData = await this.emailVerificationTokenRepo.create(emailVerificationToken);
    await this.emailVerificationTokenRepo.save(createAuthTokenData);

    return createAuthTokenData;
  }
}
