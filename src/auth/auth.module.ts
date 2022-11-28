import { CacheModule, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthV1Controller } from '@src/auth/controllers/auth.controller';
import { AuthV1Service } from '@src/auth/services/auth-v1.service';
import { UserEntity } from '@src/user/entities/user.entity';
import { UserV1Service } from '@src/user/services/user-v1.service';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CacheModule.register(),
    UserModule,
  ],
  controllers: [AuthV1Controller],
  providers: [AuthV1Service, UserV1Service, JwtService],
  exports: [AuthV1Service],
})
export class AuthModule {}
