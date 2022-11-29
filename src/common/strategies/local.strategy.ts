import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthV1Service } from '../../auth/services/auth-v1.service';
import { UserEntity } from '@src/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthV1Service) private authService: AuthV1Service) {
    super();
  }

  // method used for validating user
  public async validate(email: string, password: string): Promise<UserEntity> {
    // check user validation
    const user = await this.authService.validateLogin(email, password);

    return user;
  }
}
