import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ormOptions } from '@src/ormconfig';
import { UserEntity } from '@src/user/entities/user.entity';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class VerifyMiddleware implements NestMiddleware {
  private connection: DataSource;
  async use(req: Request, res: Response, next: NextFunction) {
    // create connection to database
    this.connection = await createConnection();
    if (!this.connection) throw new InternalServerErrorException();

    // fetch user by email
    const user = await this.connection
      .getRepository(UserEntity)
      .findOneBy({ email: req.body.email });
    if (!user.verified_at)
      throw new UnauthorizedException(
        "Can't login, you should verify your account first",
      );
    next();
  }
}

async function createConnection() {
  return await new DataSource(ormOptions).initialize();
}
