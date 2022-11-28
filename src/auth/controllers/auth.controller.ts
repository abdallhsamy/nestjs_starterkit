import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthV1Service } from '@src/auth/services/auth-v1.service';
import { RegisterV1Dto } from '@src/auth/dto/register-v1.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginV1Dto } from '@src/auth/dto/login-v1.dto';
import { ResetPasswordV1Dto } from '@src/auth/dto/reset-password-v1.dto';
import { getRestfulResponse } from '@src/common/lib/controller-response.helper';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
@Controller('auth')
export class AuthV1Controller {
  constructor(private readonly service: AuthV1Service) {}

  @Post('register') // Register a new user
  async register(@Body() dto: RegisterV1Dto, @Res() res: Response) {
    const data = await this.service.register(dto);
    getRestfulResponse(res, HttpStatus.CREATED, data);
  }

  @Post('login') // Login user
  async login(@Body() dto: LoginV1Dto, @Res() res: Response) {
    const data = await this.service.login(dto);
    getRestfulResponse(res, HttpStatus.OK, data);
  }

  @Get('verify/:token') // Validates the token sent in the email and activates the user's account
  async verify(@Param('token') token: string) {
    return this.service.verify(token);
  }

  @Get('resend-verification/:email') // Resend verification email
  async resendVerification(@Param('email') email: string) {
    return this.service.resendVerification(email);
  }

  @Get('forgot-password/:email') // Send a token via email to reset the password
  async forgotPassword(@Param('email') email: string) {
    return this.service.forgotPassword(email);
  }

  @Post('reset-password') // Change user password
  async resetPassword(@Body() dto: ResetPasswordV1Dto) {
    return this.service.resetPassword(dto);
  }
}
