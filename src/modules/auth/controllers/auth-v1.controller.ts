import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Res,
  HttpStatus,
  UseGuards,
  Render,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ForgotPasswordV1Dto } from '../dto/forgot-password-v1.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { ResendVerificationV1Dto } from '../dto/resend-verification-v1.dto';
import { VerifyV1Dto } from '../dto/verify-v1.dto';
import { LoginV1Dto } from '../dto/login-v1.dto';
import { RegisterV1Dto } from '../dto/register-v1.dto';
import { ResetPasswordV1Dto } from '../dto/reset-password-v1.dto';
import { AuthV1Service } from '../services/auth-v1.service';

@ApiBearerAuth()
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
@Controller('auth')
export class AuthV1Controller {
  constructor(private readonly service: AuthV1Service) {}

  @Post('register')
  @Render('email_verification.mail')
  async register(@Body() dto: RegisterV1Dto, @Res() res: Response) {
    await this.service.register(dto);

    return res.status(HttpStatus.CREATED).json({
      message: 'account registered successfully, please check your email',
    });
  }

  @Post('login')
  async login(@Body() dto: LoginV1Dto, @Res() res: Response) {
    const data = await this.service.login(dto);

    return res.status(HttpStatus.OK).json(data);
  }

  @Get('verify-email')
  async verify(@Query() query: VerifyV1Dto, @Res() res: Response) {
    await this.service.verify(query.token);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'email verified successfully' });
  }

  @Get('resend-verification/:email')
  async resendVerification(
    @Param() params: ResendVerificationV1Dto,
    @Res() res: Response,
  ) {
    await this.service.resendVerification(params.email);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'please check your mailboc' });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgetPasswordDto: ForgotPasswordV1Dto,
    @Res() res: Response,
  ) {
    await this.service.forgotPassword(forgetPasswordDto);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'please check your email' });
  }

  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordV1Dto,
    @Request() req: any,
    @Res() res: Response,
  ) {
    await this.service.resetPassword(dto);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'password changed successfully' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req: any, @Res() res: Response) {
    this.service.logout(req);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'successfully logged out' });
  }
}
