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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@src/user/entities/user.entity';
import { generateRandomText } from '@src/common/lib/utils/random.';
import { ForgetPasswordV1Service } from './forget-password-v1.service';
import { ForgotPasswordV1Dto } from '../dto/forgot-password-v1.dto';
import { EmailVerificationTokenEntity } from "@src/auth/entities/email-verification-token.entity";
import config from "@config/index";
import * as bcrypt from "bcrypt";
import { LoginV1Resource } from "@src/auth/resources/login-v1.resource";

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
    const registerRequestData =
      await this.authMapper.prepareRegisterUserDataMapper(dto);

    return await this.userService.create(registerRequestData);
  }

  public async login(dto: LoginV1Dto) {
    const user = await this.getUserByKey('email', dto.email);

    if (! bcrypt.compareSync(dto.password, user.password)) {
      throw new UnprocessableEntityException('Passwords mismatch');
    }

    const userPayload = this.authMapper.prepareUserPayload(user);

    const jwt = new JwtService()

    const token = jwt.sign(userPayload, { secret: config('app.secret_key') });

    const emailVerificationToken = await this.createAuthToken(user, token);

    return LoginV1Resource.single(user, emailVerificationToken.token);
  }

  public async verify(token: string){
    // user_id = db.table('email_verification_tokens').where('token' = 'token).where('created_at' >= DATE('created_at + 10 minutes').limit(1));
    // user = userentity.findOne(user_id);
    // user..update.email_verified_at = new Date();

    // return { "email verified successfully"};
  }

  public async resendVerification(email: string) {
    return 'resendVerification'; // todo : implement resendVerification
  }

  public async forgotPassword(forgetPassDto: ForgotPasswordV1Dto) {
    const user = await this.userService.findOneByKey('email', forgetPassDto.email);

    const password = await encodePassword(generateRandomText(5));

    const forgotPasswordRequest = this.authMapper.forgotPasswordMapper(user, password, forgetPassDto.token);

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

    const emailVerificationToken = this.authMapper.createAuthTokenMapper(user, token);

    const createAuthTokenData = await this.emailVerificationTokenRepo.create(emailVerificationToken);

    await this.emailVerificationTokenRepo.save(createAuthTokenData);

    return createAuthTokenData;
  }

  public async validateLogin(email: string, password: string) {

    const user = await this.getUserByKey('email', email);

    if (! comparePasswords(password, user.password)) {
      throw new UnprocessableEntityException('Passwords mismatch');
    }

    return user;
  }
}
