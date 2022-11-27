import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthV1Service } from "@src/auth/services/auth-v1.service";
import { RegisterV1Dto } from "@src/auth/dto/register-v1.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LoginV1Dto } from "@src/auth/dto/login-v1.dto";
import { ResetPasswordV1Dto } from "@src/auth/dto/reset-password-v1.dto";

@ApiBearerAuth()
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
@Controller('auth')
export class AuthV1Controller {
  constructor(private readonly service: AuthV1Service) {}

  @Post('register') // Register a new user
  register(@Body() dto: RegisterV1Dto) {
    return this.service.register(dto);
  }

  @Post('login') // Login user
  login(@Body() dto: LoginV1Dto) {
    return this.service.login(dto);
  }

  @Get('verify/:token') // Validates the token sent in the email and activates the user's account
  verify(@Param('token') token: string) {
    return this.service.verify(token);
  }

  @Get('resend-verification/:email') // Resend verification email
  resendVerification(@Param('email') email: string) {
    return this.service.resendVerification(email);
  }

  @Get('forgot-password/:email') // Send a token via email to reset the password
  forgotPassword(@Param('email') email: string) {
    return this.service.forgotPassword(email);
  }

  @Post('reset-password') // Change user password
  resetPassword(@Body() dto: ResetPasswordV1Dto) {
    return this.service.resetPassword(dto);
  }
}
