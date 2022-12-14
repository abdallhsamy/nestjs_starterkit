import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgetPasswordTokenEntity } from '../entities/forget-password-token.entity';

@Injectable()
export class ForgetPasswordV1Service {
  constructor(
    @InjectRepository(ForgetPasswordTokenEntity)
    private forgetPassRepo: Repository<ForgetPasswordTokenEntity>,
  ) {}

  public async forgetPassword(forgetPasswordRequest: any) {
    const forgetPass = this.forgetPassRepo.create(forgetPasswordRequest);
    return await this.forgetPassRepo.save(forgetPass);
  }
}
