import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgetPasswordEntity } from '../entities/forget-password.entity';

@Injectable()
export class ForgetPasswordV1Service {
  constructor(
    @InjectRepository(ForgetPasswordEntity) private forgetPassRepo: Repository<ForgetPasswordEntity>,
  ) {}

  public async forgetPassword(forgetPasswordRequest: any) {
    const forgetPass = await this.forgetPassRepo.create(forgetPasswordRequest);
    return await this.forgetPassRepo.save(forgetPass);
  }
}
