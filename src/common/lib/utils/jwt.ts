import { JwtService } from '@nestjs/jwt';
import config from '@config/index';

export function generateToken(payload: any, jwtService: JwtService): string {
  return jwtService.sign(payload, { secret: config('app.secret_key') });
}
