import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UserV1Service } from '@src/user/services/user-v1.service';
import config from '../config';
import { UserEntity } from '@src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserV1Service) private readonly userService: UserV1Service) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config('app.secret_key'),
    });
  }

  public async validate(validationPayload: {
    email: string;
    sub: string;
  }): Promise<UserEntity> {
    return await this.userService.findOneByKey('email', validationPayload.email);
  }
}

