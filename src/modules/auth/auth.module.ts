import { CacheModule, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@src/common/strategies/local.strategy';
import { ForgetPasswordV1Service } from './services/forget-password-v1.service';
import config from '@src/common/config';
import { JwtStrategy } from '@src/common/strategies/jwt.strategy';
import { MailModule } from '@src/common/lib/services/mail/mail.module';
import { UserEntity } from '../user/entities/user.entity';
import { UserV1Service } from '../user/services/user-v1.service';
import { UserModule } from '../user/user.module';
import { AuthV1Controller } from './controllers/auth-v1.controller';
import { EmailVerificationTokenEntity } from './entities/email-verification-token.entity';
import { ForgetPasswordTokenEntity } from './entities/forget-password-token.entity';
import { AuthV1Service } from './services/auth-v1.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EmailVerificationTokenEntity,
      ForgetPasswordTokenEntity,
    ]),
    CacheModule.register(),
    UserModule,
    MailModule,
    PassportModule,
    PassportModule.register({ session: false, defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config('app.secret_key', 'SECRET_KEY'),
      signOptions: { expiresIn: config('app.token_expire') },
    }),
  ],
  controllers: [AuthV1Controller],
  providers: [
    AuthV1Service,
    UserV1Service,
    ForgetPasswordV1Service,
    JwtService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthV1Service],
})
export class AuthModule {}
