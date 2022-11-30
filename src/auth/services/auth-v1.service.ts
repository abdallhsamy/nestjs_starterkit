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
import { EmailVerificationTokenEntity } from '@src/auth/entities/email-verification-token.entity';
import config from '@config/index';
import * as bcrypt from 'bcrypt';
import { LoginV1Resource } from '@src/auth/resources/login-v1.resource';
import { ForgetPasswordTokenEntity } from '@src/auth/entities/forget-password-token.entity';
import { generateToken } from '@src/common/lib/utils/jwt';
import { RegisterV1Dto } from '../dto/register-v1.dto';

@Injectable()
export class AuthV1Service {
  private authMapper: AuthMapper;
  constructor(
    @InjectRepository(EmailVerificationTokenEntity)
    private emailVerificationTokenRepo: Repository<EmailVerificationTokenEntity>,
    @InjectRepository(ForgetPasswordTokenEntity)
    private forgetPassRepo: Repository<ForgetPasswordTokenEntity>,
    private readonly userService: UserV1Service,
    private readonly forgetPassService: ForgetPasswordV1Service,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {
    this.authMapper = new AuthMapper();
  }

  public async register(dto: RegisterV1Dto) {

    dto.password = await encodePassword(dto.password);

    const user = this.userRepo.create(dto);

    await this.userRepo.save(user);

    const token = Math.floor(Math.random() * 90000) + 10000;


    const emailVerificationToken = {
      token : (Math.floor(Math.random() * 90000) + 10000).toString(),
      user_id : user.id,
    }

    await this.emailVerificationTokenRepo.save(emailVerificationToken);

    // todo: send email with verify link
  }

  public async login(dto: LoginV1Dto) {
    const user = await this.getUserByKey('email', dto.email);

    if (!bcrypt.compareSync(dto.password, user.password)) {
      throw new UnprocessableEntityException('Passwords mismatch');
    }

    const userPayload = this.authMapper.prepareUserPayload(user);

    const jwt = new JwtService();

    const token = jwt.sign(userPayload, { secret: config('app.secret_key') });

    return LoginV1Resource.single(user, token);
  }

  public async verify(token: string) {
    // user_id = db.table('email_verification_tokens').where('token' = 'token).where('created_at' >= DATE('created_at + 10 minutes').limit(1));
    // user = userentity.findOne(user_id);
    // user..update.email_verified_at = new Date();
    // return { "email verified successfully"};
  }

  public async resendVerification(email: string) {
    return 'resendVerification'; // todo : implement resendVerification
  }

  public async forgotPassword(dto: ForgotPasswordV1Dto) {
    const user = await this.userService.findOneByKey('email', dto.email);

    if (!user) {
      throw new NotFoundException('No User associated with email ' + dto.email);
    }

    const newToken = {
      user_id: user.id,
      token: Math.floor(Math.random() * 90000) + 10000,
    };
    // this.forgetPassRepo.create(newToken)

    // send email with token

    // return { "please check your email"};
  }

  public async resetPassword(dto: ResetPasswordV1Dto) {
    return 'resetPassword'; // todo : implement resetPassword
  }

  private async getUserByKey(key: string, value: any) {
    const user = await this.userService.findOneByKey(key, value);

    if (!user) throw new NotFoundException("User isn't registered");

    return user;
  }

  public async validateLogin(email: string, password: string) {
    const user = await this.getUserByKey('email', email);

    if (!comparePasswords(password, user.password)) {
      throw new UnprocessableEntityException('Passwords mismatch');
    }

    return user;
  }

  // private async createAuthToken(user: any, token: number) {
  //   const emailVerificationToken = this.authMapper.createAuthTokenMapper(
  //     user,
  //     token,
  //   );
  //
  //   const createAuthTokenData = await this.emailVerificationTokenRepo.create(
  //     emailVerificationToken,
  //   );
  //
  //   await this.emailVerificationTokenRepo.save(createAuthTokenData);
  //
  //   return createAuthTokenData;
  // }
}
