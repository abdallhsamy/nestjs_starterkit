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
import { ForgotPasswordV1Dto } from '../dto/forgot-password-v1.dto';
import { EmailVerificationTokenEntity } from '@src/auth/entities/email-verification-token.entity';
import config from '@config/index';
import * as bcrypt from 'bcrypt';
import { LoginV1Resource } from '@src/auth/resources/login-v1.resource';
import { ForgetPasswordTokenEntity } from '@src/auth/entities/forget-password-token.entity';
import { RegisterV1Dto } from '../dto/register-v1.dto';
import { MailService } from '@src/mail/mail.service';

@Injectable()
export class AuthV1Service {
  private authMapper: AuthMapper;
  constructor(
    @InjectRepository(EmailVerificationTokenEntity)
    private emailVerificationTokenRepo: Repository<EmailVerificationTokenEntity>,
    @InjectRepository(ForgetPasswordTokenEntity)
    private forgetPassRepo: Repository<ForgetPasswordTokenEntity>,
    private readonly userService: UserV1Service,
    private readonly mailService: MailService,
  ) {
    this.authMapper = new AuthMapper();
  }

  public async register(dto: RegisterV1Dto) {
    dto.password = await encodePassword(dto.password);
    dto.password_confirmation = undefined;

    const registeredUser = await this.userService.register(dto);

    const token = Math.floor(Math.random() * 90000) + 10000;

    const verificationToken = await this.createAuthToken(registeredUser, token);

    await this.emailVerificationTokenRepo.save(verificationToken);

    // if it isn't working so comment the mail request
    await this.mailService.sendUserConfirmation(
      registeredUser,
      verificationToken.token,
    );
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
    // fetch token data and verify it
    const VerifytokenData = await this.emailVerificationTokenRepo.findOneBy({
      token,
    });
    const isExpired =
      VerifytokenData.created_at.getTime() + 10 * 60 * 1000 <= Date.now();
    if (!!isExpired) throw new NotFoundException('Token expired or not found');

    await this.userService.update(VerifytokenData.user_id, {
      verified_at: new Date(),
    });
    return { message: 'email verified successfully' };
  }

  public async resendVerification(email: string) {
    return 'resendVerification'; // todo : implement resendVerification
  }

  public async forgotPassword(dto: ForgotPasswordV1Dto) {
    const user = await this.userService.findOneByKey('email', dto.email);

    if (!user) {
      throw new NotFoundException('No User associated with email ' + dto.email);
    }

    const newToken: Object = {
      user: user,
      token: Math.floor(Math.random() * 90000) + 10000,
    };
    const forgotPass = await this.forgetPassRepo.create(newToken);
    const createdForgetPass = await this.forgetPassRepo.save(forgotPass);
    if (!createdForgetPass)
      throw new UnprocessableEntityException(
        "Can't create forget password token",
      );

    // if it isn't working so comment the mail request
    await this.mailService.sendForgetPasswordMail(
      forgotPass.user,
      forgotPass.token,
    );

    return { message: 'please check your email' };
  }

  public async resetPassword(dto: ResetPasswordV1Dto) {
    const hashNewPassword = await encodePassword(dto.password);
    return await this.userService.update(dto.user_id, {
      password: hashNewPassword,
    });
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

  private async createAuthToken(user: any, token: any) {
    const createAuthTokenData = await this.emailVerificationTokenRepo.create({
      user,
      token,
    });

    await this.emailVerificationTokenRepo.save(createAuthTokenData);

    return createAuthTokenData;
  }
}
