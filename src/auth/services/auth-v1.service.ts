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
import { MailerService } from "@nestjs-modules/mailer";
import { MailService } from "@src/mail/mail.service";
import passport from "passport";
import now = jest.now;

@Injectable()
export class AuthV1Service {
  private authMapper: AuthMapper;
  constructor(
    @InjectRepository(EmailVerificationTokenEntity)
    private emailVerificationTokenRepo: Repository<EmailVerificationTokenEntity>,
    @InjectRepository(ForgetPasswordTokenEntity)
    private forgetPasswordRepo: Repository<ForgetPasswordTokenEntity>,
    private readonly userService: UserV1Service,
    private readonly forgetPassService: ForgetPasswordV1Service,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private mailService: MailService
  ) {
    this.authMapper = new AuthMapper();
  }

  public async register(dto: RegisterV1Dto) {
    dto.password = await encodePassword(dto.password);

    const user = this.userRepo.create(dto);

    await this.userRepo.save(user);

    const verificationToken = {
      token : (Math.floor(Math.random() * 90000) + 10000).toString(),
      user_id : user.id,
    }

    await this.emailVerificationTokenRepo.save(verificationToken);

    await this.mailService.sendUserConfirmation(user, verificationToken.token);
  }

  public async login(dto: LoginV1Dto) {
    const user = await this.userService.findOneByKey('email', dto.email);

    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new UnprocessableEntityException('email is not found or password is incorrect');
    }

    const userPayload = {
      sub: user.id,
      name: user.name,
    };

    const jwt = new JwtService();

    const token = jwt.sign(user, { secret: config('app.secret_key') });

    return LoginV1Resource.single(user, token);
  }

  public async verify(token: string) {

    // todo : if user is authenticated and verified pass this logic
    const data = await this.emailVerificationTokenRepo.findOneBy({ token });

    const isExpired = data.created_at.getTime() + 10 * 60 * 1000 <= Date.now();
    if (!!isExpired) throw new NotFoundException('Token expired or not found');

    // todo : delete all tokens;
    await this.userService.update(data.user_id, { verified_at: new Date()});

    // todo : login and return token
  }

  public async resendVerification(email: string) {

    const user = await this.userService.findOneByKey('email', email);

    if (!user) throw new NotFoundException(`no user associated with this email : ${email}`)

    const existingTokens = await this.emailVerificationTokenRepo.findBy({'user_id': user.id});

    let verificationToken;

    if (!existingTokens || !existingTokens.length) {
      verificationToken = { user_id : user.id, token : (Math.floor(Math.random() * 90000) + 10000).toString()}
    } else {
      verificationToken = existingTokens[0]
      verificationToken.created_at = new Date();
    }

    await this.emailVerificationTokenRepo.save(verificationToken);

    await this.mailService.sendUserConfirmation(user, verificationToken.token);
  }

  public async forgotPassword(dto: ForgotPasswordV1Dto) {
    const user = await this.userService.findOneByKey('email', dto.email);

    if (!user) {
      throw new NotFoundException('No User associated with email : ' + dto.email);
    }

    const forgotPass = await this.forgetPasswordRepo.create({
      user_id: user.id,
      token: (Math.floor(Math.random() * 90000) + 10000).toString(),
    });

    const createdForgetPass = await this.forgetPasswordRepo.save(forgotPass);

    if (!createdForgetPass) throw new UnprocessableEntityException("Can't create forget password token");

    await this.mailService.sendForgetPasswordMail(
      forgotPass.user,
      forgotPass.token,
    );
  }

  public async resetPassword(dto: ResetPasswordV1Dto) {
    const userToken = await this.forgetPasswordRepo.findOneBy({token: dto.token});
    const password = await encodePassword(dto.password);
    await this.userService.update(userToken.user_id, { password});
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


  public async logout() {
    // todo : delete all auth tokens form current user
  }
}
