import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Request,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthV1Service } from '@src/auth/services/auth-v1.service';
import { RegisterV1Dto } from '@src/auth/dto/register-v1.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginV1Dto } from '@src/auth/dto/login-v1.dto';
import { ResetPasswordV1Dto } from '@src/auth/dto/reset-password-v1.dto';
import { getRestfulResponse } from '@src/common/lib/controller-response.helper';
import { Response } from 'express';
import { ForgotPasswordV1Dto } from '../dto/forgot-password-v1.dto';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
@Controller('auth')
export class AuthV1Controller {
  constructor(private readonly service: AuthV1Service) {}

  @Post('register')
  async register(@Body() dto: RegisterV1Dto, @Res() res: Response) {
    await this.service.register(dto);

    return res.status(HttpStatus.CREATED).json({
      message : 'account registered successfully, please check your email'
    });
  }

  @Post('login')
  async login(@Body() dto: LoginV1Dto, @Res() res: Response) {
    const data = await this.service.login(dto);
    getRestfulResponse(res, HttpStatus.OK, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify') // Validates the token sent in the email and activates the user's account
  async verify(@Request() req: any) {
    return await this.service.verify(req.user);
  }

  @Get('resend-verification/:email') // Resend verification email
  async resendVerification(@Param('email') email: string) {
    return this.service.resendVerification(email);
  }

  @Post('forgot-password') // Send a token via email to reset the password
  async forgotPassword(@Body() forgetPasswordDto: ForgotPasswordV1Dto) {
    return await this.service.forgotPassword(forgetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password') // Change user password
  async resetPassword(@Body() dto: ResetPasswordV1Dto, @Request() req: any) {
    return this.service.resetPassword(dto);
  }
}
