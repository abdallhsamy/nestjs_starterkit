import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { comparePasswords, encodePassword } from '@src/common/lib/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgotPasswordV1Dto } from '../dto/forgot-password-v1.dto';
import config from '@config/index';
import * as bcrypt from 'bcrypt';
import { RegisterV1Dto } from '../dto/register-v1.dto';
import { MailService } from '@src/common/lib/services/mail/mail.service';
import { UserV1Service } from '@src/modules/user/services/user-v1.service';
import { LoginV1Dto } from '../dto/login-v1.dto';
import { ResetPasswordV1Dto } from '../dto/reset-password-v1.dto';
import { EmailVerificationTokenEntity } from '../entities/email-verification-token.entity';
import { ForgetPasswordTokenEntity } from '../entities/forget-password-token.entity';
import { LoginV1Resource } from '../resources/login-v1.resource';

@Injectable()
export class AuthV1Service {
  constructor(
    @InjectRepository(EmailVerificationTokenEntity)
    private emailVerificationTokenRepo: Repository<EmailVerificationTokenEntity>,
    @InjectRepository(ForgetPasswordTokenEntity)
    private forgetPasswordRepo: Repository<ForgetPasswordTokenEntity>,
    private readonly userService: UserV1Service,
    private readonly mailService: MailService,
  ) {}

  public async register(dto: RegisterV1Dto) {
    dto.password = await encodePassword(dto.password);
    dto.password_confirmation = undefined;

    const registeredUser = await this.userService.register(dto);

    const token = Math.floor(Math.random() * 90000) + 10000;

    const verifyRequest: object = { user: registeredUser, token };

    const verificationToken = await this.emailVerificationTokenRepo.create(
      verifyRequest,
    );

    await this.emailVerificationTokenRepo.save(verificationToken);

    // if it isn't working so comment the mail request
    await this.mailService.sendUserConfirmation(
      registeredUser,
      verificationToken.token,
    );
  }

  public async login(dto: LoginV1Dto) {
    const user = await this.userService.findOneByKey('email', dto.email);

    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new UnprocessableEntityException(
        'email is not found or password is incorrect',
      );
    }

    const userPayload = {
      sub: user.id,
      name: user.name,
    };

    const jwt = new JwtService();

    const token = jwt.sign(userPayload, { secret: config('app.secret_key', 'SECRET_KEY') });

    return LoginV1Resource.single(user, token);
  }

  public async verify(token: string) {
    const data = await this.emailVerificationTokenRepo.findOneBy({ token });

    const isExpired = data?.created_at.getTime() + 10 * 60 * 1000 <= Date.now();
    if (!data || isExpired)
      throw new NotFoundException('Token expired or not found');

    // remove all existing verify tokens (not need them any more)
    await this.emailVerificationTokenRepo.delete({ user_id: data.user_id });

    await this.userService.update(data.user_id, { verified_at: new Date() });
  }

  public async resendVerification(email: string) {
    const user = await this.userService.findOneByKey('email', email);

    if (!user)
      throw new NotFoundException(
        `no user associated with this email : ${email}`,
      );

    const existingTokens = await this.emailVerificationTokenRepo.findBy({
      user_id: user.id,
    });

    let verificationToken;

    if (!existingTokens || !existingTokens.length) {
      verificationToken = {
        user_id: user.id,
        token: (Math.floor(Math.random() * 90000) + 10000).toString(),
      };
    } else {
      verificationToken = existingTokens[0];
      verificationToken.created_at = new Date();
    }

    await this.emailVerificationTokenRepo.save(verificationToken);

    // await this.mailService.sendUserConfirmation(user, verificationToken.token);
  }

  public async forgotPassword(dto: ForgotPasswordV1Dto) {
    const user = await this.userService.findOneByKey('email', dto.email);

    if (!user) {
      throw new NotFoundException(
        'No User associated with email : ' + dto.email,
      );
    }

    const forgotPass = await this.forgetPasswordRepo.create({
      user: user,
      token: (Math.floor(Math.random() * 90000) + 10000).toString(),
    });

    const createdForgetPass = await this.forgetPasswordRepo.save(forgotPass);

    if (!createdForgetPass)
      throw new UnprocessableEntityException(
        "Can't create forget password token",
      );

    await this.mailService.sendForgetPasswordMail(
      forgotPass.user,
      forgotPass.token,
    );
  }

  public async resetPassword(dto: ResetPasswordV1Dto) {
    const userToken = await this.forgetPasswordRepo.findOneBy({
      token: dto.token,
    });
    const password = await encodePassword(dto.password);
    await this.userService.update(userToken.user_id, { password });
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

  public logout(req: any) {
    req.res.setHeader('Authorization', null);
  }
}
