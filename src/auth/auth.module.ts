import { CacheModule, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthV1Controller } from '@src/auth/controllers/auth.controller';
import { AuthV1Service } from '@src/auth/services/auth-v1.service';
import { LocalStrategy } from '@src/common/strategies/local.strategy';
import { UserEntity } from '@src/user/entities/user.entity';
import { UserV1Service } from '@src/user/services/user-v1.service';
import { UserModule } from '@src/user/user.module';
import { AuthTokenEntity } from './entities/auth-token.entity';
import { ForgetPasswordEntity } from './entities/forget-password.entity';
import { ForgetPasswordV1Service } from './services/forget-password-v1.service';
import config from '@src/common/config';
import { JwtStrategy } from '@src/common/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AuthTokenEntity,
      ForgetPasswordEntity,
    ]),
    CacheModule.register(),
    UserModule,
    PassportModule,
    PassportModule.register({ session: false, defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config('app.secret_key'),
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
